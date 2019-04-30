const SchemaWithGenerators = require('./SchemaWithGenerators')
const Type = require('./types/Type')

class Parameter extends SchemaWithGenerators {

    static get schemaName() {
        return 'Parameter'
    }

    static fromObj(obj) {
        return new Parameter(Type.fromObj(obj.type), obj.name, obj.description)
    }

    constructor(type, name, description) {
        super()
        Object.assign(this, {type, name, description})
    }
}

module.exports = Parameter