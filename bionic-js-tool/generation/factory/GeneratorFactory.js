class GeneratorFactory {

    constructor(schema) {
        Object.assign(this, {schema, target: '', generatorParams: []})
    }

    get swift() {
        this.language = 'Swift'
        return this.generator
    }

    get java() {
        this.language = 'Java'
        return this.generator
    }

    get javascript() {
        this.language = 'Javascript'
        return this.generator
    }

    get generator() {
        const GeneratorClass = (require(this.generatorPath)[this.generatorName])
        return new GeneratorClass(this.schema, ...this.generatorParams)
    }

    get generatorPath() {
        return `../${this.language.toLowerCase()}/${this.generatorName}`
    }

    get generatorName() {
        return `${this.language}${this.target}${this.schema.constructor.schemaName}Generator`
    }

    forHosting(...params) {
        this.target = 'Host'
        this.generatorParams = params
        return this
    }

    forWrapping(...params) {
        this.target = 'Wrapper'
        this.generatorParams = params
        return this
    }
}

module.exports = {GeneratorFactory}