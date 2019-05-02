const Generable = require('./Generable')
const Type = require('./types/Type')

class Parameter extends Generable {

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