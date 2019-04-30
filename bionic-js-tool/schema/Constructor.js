const SchemaWithGenerators = require('./SchemaWithGenerators')
const Parameter = require('./Parameter')

class Constructor extends SchemaWithGenerators {

    static get schemaName() {
        return 'Constructor'
    }

    static fromObj(obj) {
        return new Constructor(obj.description, obj.parameters.map(par => Parameter.fromObj(par)))
    }

    constructor(description, parameters) {
        super()
        Object.assign(this, {description, parameters})
    }
}

module.exports = Constructor