const {ModuleSchemaCreator} = require('../parser/ModuleSchemaCreator')
const {AnnotatedGuestFile} = require('../filesystem/AnnotatedGuestFile')

class GlobalSchemaCreator {

    constructor(guestFiles) {
        Object.assign(this, {guestFiles})
    }

    get moduleCreatorPromises() {
        return this.guestFiles.filter(guestFile => guestFile.isJavascript)
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

    async getAnnotatedFiles() {
        const moduleCreators = await this.getModuleCreators()
        const moduleCreatorsMap = new Map(moduleCreators.map(creator => [creator.guestFile.path, creator]))
        const annotatedFiles = this.guestFiles.map(guestFile => {
            const moduleCreator = moduleCreatorsMap.get(guestFile.path)
            return new AnnotatedGuestFile(guestFile, moduleCreator ? moduleCreator.getSchema(moduleCreators) : null)
        })

        const nativeClassesMap = new Map(annotatedFiles
            .filter(annotatedFile => annotatedFile.exportsClass)
            .map(annotatedFile => [annotatedFile.schema.name, annotatedFile.exportsNativeClass]),
        )
        return annotatedFiles.map(annotatedFile => annotatedFile.resolveClassType(nativeClassesMap))
    }
}

module.exports = {GlobalSchemaCreator}