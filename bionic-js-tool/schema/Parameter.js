const SchemaWithGenerators = require('./SchemaWithGenerators')
const Type = require('./types/Type')

class Parameter extends SchemaWithGenerators {
    
    constructor(type, name, description) {
        super()
        Object.assign(this, {type, name, description})
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../generation/host/${directory}/${classPrefix}ParameterGenerator`)
    }

    static fromObj(obj) {
        return new Parameter(Type.fromObj(obj.type), obj.name, obj.description)
    }
}

module.exports = Parameter