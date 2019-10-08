const {ModuleSchemaCreator} = require('../parser/ModuleSchemaCreator')

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

    async getGuestFileSchemas() {
        const moduleCreators = await this.getModuleCreators()
        return moduleCreators.map(moduleCreator => ({
            guestFile: moduleCreator.guestFile,
            schema: moduleCreator.getSchema(moduleCreators),
        }))
    }
}

module.exports = {GlobalSchemaCreator}