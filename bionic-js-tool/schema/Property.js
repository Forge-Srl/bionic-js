const SchemaWithGenerators = require('./SchemaWithGenerators')
const Type = require('./types/Type')

class Property extends SchemaWithGenerators {

    constructor(name, description, isStatic, isOverriding, type, kind) {
        super()
        Object.assign(this, {name, description, isStatic, isOverriding, type, kind})
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../generation/host/${directory}/${classPrefix}PropertyGenerator`)
    }

    static fromObj(obj) {
        return new Property(obj.name, obj.description, obj.isStatic, obj.isOverriding, Type.fromObj(obj.type),
            obj.kind)
    }
}

module.exports = Property