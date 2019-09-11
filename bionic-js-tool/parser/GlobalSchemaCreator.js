const {ModuleSchemaCreator} = require('../parser/ModuleSchemaCreator')

class GlobalSchemaCreator {

    constructor(guestFiles) {
        Object.assign(this, {guestFiles})
    }

    async getClassSchemaCreators() {
        const classSchemaCreatorsPromises = this.guestFiles.map(
            guestFile => new ModuleSchemaCreator(guestFile).getClassSchemaCreators())
        return (await Promise.all(classSchemaCreatorsPromises)).flat()
    }

    async getClassSchemas() {
        const classSchemaCreators = new Map()
        for (const creator of await this.getClassSchemaCreators()) {
            const alreadyExistentCreator = classSchemaCreators.get(creator.name)
            if (alreadyExistentCreator) {
                throw new Error(`Class ${creator.name} in module "${creator.modulePath}" was already` +
                    `exported in module "${alreadyExistentCreator.modulePath}"`)
            }
            classSchemaCreators.set(creator.name, creator)
        }

        return [...classSchemaCreators.values()].map(creator => creator.getSchema(classSchemaCreators))
    }
}

module.exports = {GlobalSchemaCreator}