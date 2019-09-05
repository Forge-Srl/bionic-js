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
        const creatorsMap = new Map()
        for (const creator of await this.getClassSchemaCreators()) {
            const alreadyExistentCreator = creatorsMap.has(creator.name)
            if (alreadyExistentCreator) {
                new Error(`Class ${creator.name} in module "${creator.modulePath}" was already` +
                    `exported in module "${alreadyExistentCreator.modulePath}"`)
            }
            creatorsMap.set(creator.name, creator)
        }

        return [...creatorsMap.values()].map(creator => creator.getSchema(creatorsMap))
    }
}

module.exports = {GlobalSchemaCreator}