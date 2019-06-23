const {GeneratorFactory} = require('./GeneratorFactory')

class TypeGeneratorFactory extends GeneratorFactory {

    get swift() {
        this.language = 'Swift'
        return this.getGenerator()
    }

    get java() {
        this.language = 'Java'
        return this.getGenerator()
    }

    get generatorName() {
        return `${this.language}${this.schema.constructor.typeName}TypeGenerator`
    }

    get generatorPath() {
        return `../${this.language.toLowerCase()}/types/${this.generatorName}`
    }
}

module.exports = {TypeGeneratorFactory}