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

    get generatorName() {
        return `${this.language}${this.target}${this.schema.constructor.schemaName}Generator`
    }

    get generatorPath() {
        if (this.language === undefined) {
            console.log('')
        }
        return `../${this.language.toLowerCase()}/${this.generatorName}`
    }

    getGenerator(...params) {
        const GeneratorClass = (require(this.generatorPath)[this.generatorName])
        return new GeneratorClass(this.schema, ...params)
    }
}

module.exports = {GeneratorFactory}