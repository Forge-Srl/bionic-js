const SchemaWithGenerators = require('./SchemaWithGenerators')
const Type = require('./types/Type')
const Parameter = require('./Parameter')

class Method extends SchemaWithGenerators {

    static get schemaName() {
        return 'Method'
    }

    static fromObj(obj) {
        return new Method(obj.name, obj.description, obj.isStatic, obj.isOverriding, Type.fromObj(obj.returnType),
            obj.parameters.map(par => Parameter.fromObj(par)))
    }

    constructor(name, description, isStatic, isOverriding, returnType, parameters) {
        super()
        Object.assign(this, {name, description, isStatic, isOverriding, returnType, parameters})
    }
}

module.exports = Method