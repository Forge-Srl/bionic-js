const GeneratorFactory = require('./GeneratorFactory')

class TypeGeneratorFactory extends GeneratorFactory {

    get swift() {
        this.language = 'Swift'
        return this.getGenerator()
    }

    get java() {
        this.language = 'Java'
        return this.getGenerator()
    }

    get generatorPath() {
        return `../${this.language.toLowerCase()}/types/${this.language}${this.schema.constructor.typeName}TypeGenerator`
    }
}

module.exports = TypeGeneratorFactory