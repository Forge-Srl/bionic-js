const JsonSerializable = require('../JsonSerializable')

class SchemaWithGenerators extends JsonSerializable {

    getGeneratorClass(language) {
        return require(`../generation/${language.toLowerCase()}/classParts/${language}${this.constructor.schemaName}Generator`)
    }

    getJavaGenerator(...params) {
        return new (this.getGeneratorClass('Java'))(this, ...params)
    }

    getSwiftGenerator(...params) {
        return new (this.getGeneratorClass('Swift'))(this, ...params)
    }
}

module.exports = SchemaWithGenerators