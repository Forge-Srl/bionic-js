const SchemaWithGenerators = require('../SchemaWithGenerators')

class Type extends SchemaWithGenerators {

    constructor(typeName) {
        super()
        Object.assign(this, {typeName})
    }

    get isValid() {
        return {validity: true, error: null}
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../../generation/host/${directory}/types/${classPrefix}${this.constructor.name}Generator`)
    }

    toString() {
        return this.constructor.typeName
    }

    static fromObj(obj) {
        const typesIndex = require('./typesIndex')
        return typesIndex[obj.type].fromObj(obj)
    }
}

module.exports = Type