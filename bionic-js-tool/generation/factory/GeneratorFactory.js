class GeneratorFactory {

    constructor(schema) {
        Object.assign(this, {schema, target: ''})
    }

    get swift() {
        this.language = 'Swift'
        return this.getGenerator()
    }

    get java() {
        this.language = 'Java'
        return this.getGenerator()
    }

    get generatorPath() {
        return `../${this.language.toLowerCase()}/${this.language}${this.target}${this.schema.constructor.schemaName}Generator`
    }

    getGenerator(...params) {
        const GeneratorClass = require(this.generatorPath)
        return new GeneratorClass(this.schema, ...params)
    }
}

module.exports = GeneratorFactory