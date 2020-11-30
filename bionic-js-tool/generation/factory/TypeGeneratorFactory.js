const {GeneratorFactory} = require('./GeneratorFactory')

class TypeGeneratorFactory extends GeneratorFactory {

    get generatorName() {
        return `${this.language}${this.schema.constructor.typeName}TypeGenerator`
    }

    get generatorPath() {
        return `../${this.language.toLowerCase()}/types/${this.generatorName}`
    }
}

module.exports = {TypeGeneratorFactory}