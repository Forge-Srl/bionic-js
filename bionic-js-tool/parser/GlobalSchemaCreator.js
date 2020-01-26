const {ModuleSchemaCreator} = require('../parser/ModuleSchemaCreator')
const {ExportedFile} = require('../filesystem/ExportedFile')

class GlobalSchemaCreator {

    constructor(guestFiles) {
        Object.assign(this, {guestFiles})
    }

    get moduleCreatorPromises() {
        return this.guestFiles.filter(guestFile => guestFile.isExportable)
            .map(guestFile => ModuleSchemaCreator.build(guestFile))
    }

    async getModuleCreators() {
        if (!this._moduleCreators) {
            const moduleCreators = (await Promise.all(this.moduleCreatorPromises)).filter(moduleCreator => moduleCreator.exporting)
            const processedModules = new Map()

            moduleCreators.forEach(moduleCreator => {
                const alreadyExistentModule = processedModules.get(moduleCreator.name)
                if (alreadyExistentModule) {
                    throw new Error(`class ${moduleCreator.name} in module "${moduleCreator.path}" was already ` +
                        `exported in module "${alreadyExistentModule.path}"`)
                }
                processedModules.set(moduleCreator.name, moduleCreator)
            })
            this._moduleCreators = moduleCreators
        }
        return this._moduleCreators
    }

    async getExportedFiles() {
        const moduleCreators = await this.getModuleCreators()
        const moduleCreatorsMap = new Map(moduleCreators.map(creator => [creator.guestFile.path, creator]))

        return this.guestFiles.map(guestFile => {
            const creator = moduleCreatorsMap.get(guestFile.path)
            return new ExportedFile(guestFile, creator ? creator.getSchema(moduleCreators) : null)
        })
    }
}

module.exports = {GlobalSchemaCreator}