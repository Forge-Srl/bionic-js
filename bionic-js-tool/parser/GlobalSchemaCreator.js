const {ModuleSchemaCreator} = require('../parser/ModuleSchemaCreator')

class GlobalSchemaCreator {

    constructor(guestFiles) {
        Object.assign(this, {guestFiles})
    }

    get classSchemaCreatorPromises() {
        return this.guestFiles.filter(guestFile => guestFile.isExportable)
            .map(guestFile =>
                (async () => {
                    const classSchemaCreator = (await new ModuleSchemaCreator(guestFile).getClassSchemaCreators())[0]
                    return classSchemaCreator ? {guestFile, classSchemaCreator} : undefined
                })(),
            )
    }

    async getGuestFilesWithSchemaCreators() {
        if (!this._guestFilesWithSchemaCreators) {
            this._guestFilesWithSchemaCreators = (await Promise.all(this.classSchemaCreatorPromises)).filter(entry => entry)

            const schemaCreatorsMap = new Map()
            this._guestFilesWithSchemaCreators.map(entry => entry.classSchemaCreator).forEach(schemaCreator => {

                const alreadyExistentCreator = schemaCreatorsMap.get(schemaCreator.name)
                if (alreadyExistentCreator) {
                    throw new Error(`class ${schemaCreator.name} in module "${schemaCreator.modulePath}" was already` +
                        `exported in module "${alreadyExistentCreator.modulePath}"`)
                }
                schemaCreatorsMap.set(schemaCreator.name, schemaCreator)
            })
        }
        return this._guestFilesWithSchemaCreators
    }

    async getGuestFilesWithSchemas() {
        const guestFilesWithSchemaCreators = await this.getGuestFilesWithSchemaCreators()
        const classSchemaCreators = new Map(guestFilesWithSchemaCreators.map(guestFileWithCreator =>
            [guestFileWithCreator.classSchemaCreator.name, guestFileWithCreator.classSchemaCreator]))

        return guestFilesWithSchemaCreators.map(guestFileWithCreator => {
                try {
                    return {
                        guestFile: guestFileWithCreator.guestFile,
                        schema: guestFileWithCreator.classSchemaCreator.getSchema(classSchemaCreators),
                    }
                } catch (error) {
                    throw new Error(`extracting schema from class "${guestFileWithCreator.guestFile.path}"\n${error}`)
                }
            },
        )
    }
}

module.exports = {GlobalSchemaCreator}