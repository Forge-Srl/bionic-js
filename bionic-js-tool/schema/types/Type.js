const SchemaWithGenerators = require('../SchemaWithGenerators')
const getTypeClasses = require('./getTypeClasses')

class Type extends SchemaWithGenerators {

    constructor(typeName) {
        super()
        Object.assign(this, {typeName})
    }

    get isValid() {
        return {validity: true, error: null}
    }

    getGeneratorClass(language) {
        return require(`../../generation/${language.toLowerCase()}/types/${language}${this.constructor.typeName}TypeGenerator`)
    }

    toString() {
        return this.constructor.typeName
    }

    static fromObj(obj) {
        return getTypeClasses()[obj.type].fromObj(obj)
    }
}

module.exports = Type