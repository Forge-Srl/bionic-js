const SchemaWithGenerators = require('./SchemaWithGenerators')
const Type = require('./types/Type')
const Parameter = require('./Parameter')

class Method extends SchemaWithGenerators {

    constructor(name, description, isStatic, isOverriding, returnType, parameters) {
        super()
        Object.assign(this, {name, description, isStatic, isOverriding, returnType, parameters})
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../generation/host/${directory}/${classPrefix}MethodGenerator`)
    }

    static fromObj(obj) {
        return new Method(obj.name, obj.description, obj.isStatic, obj.isOverriding, Type.fromObj(obj.returnType),
            obj.parameters.map(par => Parameter.fromObj(par)))
    }
}

module.exports = Method