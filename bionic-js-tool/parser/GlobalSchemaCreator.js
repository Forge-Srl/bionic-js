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
        const exportedFiles = this.guestFiles.map(guestFile => {
            const moduleCreator = moduleCreatorsMap.get(guestFile.path)
            return new ExportedFile(guestFile, moduleCreator ? moduleCreator.getSchema(moduleCreators) : null)
        })

        const nativeClassesMap = new Map(exportedFiles
            .filter(exportedFile => exportedFile.exportsClass)
            .map(exportedFile => [exportedFile.schema.name, exportedFile.exportsNativeClass]),
        )
        return exportedFiles.map(exportedFile => exportedFile.resolveClassType(nativeClassesMap))
    }
}

module.exports = {GlobalSchemaCreator}