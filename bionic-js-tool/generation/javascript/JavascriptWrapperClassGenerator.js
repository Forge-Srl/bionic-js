const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {Class, nativeObjectBaseClassName} = require('../../schema/Class')

class JavascriptWrapperClassGenerator extends ClassGenerator {

    constructor(schema) {
        super(schema)
    }

    get constructors() {
        return []
    }

    get classPartsGenerators() {
        if (!this._classPartsGenerators) {
            this._classPartsGenerators = this.getClassParts().map(classPart => classPart.generator.forWrapping(this.schema).javascript)
        }
        return this._classPartsGenerators
    }

    getHeaderCode() {
        const superclass = this.schema.superclass || new Class(nativeObjectBaseClassName, '', [], [], [], null, true, nativeObjectBaseClassName)
        return CodeBlock.create()
            .append(`const {${superclass.name}} = require(\'${this.schema.getRelativeModuleLoadingPath(superclass)}\')`).newLine()
            .append(`const {bjsNative} = require(\'${this.schema.name}\')`).newLine()
            .newLine()
            .append(`class ${this.schema.name} extends ${superclass.name} {`).newLineIndenting()
            .newLine()
            .append('static get bjsNative() {').newLineIndenting()
            .append('return bjsNative').newLineDeindenting()
            .append('}')
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.classPartsGenerators.map(classPartGenerator =>
                CodeBlock.create().newLine()
                    .newLine()
                    .append(classPartGenerator.getCode()),
            ))
            .newLineDeindenting()
    }

    getFooterCode() {
        return CodeBlock.create()
            .append('}').newLine()
            .newLine()
            .append(`module.exports = {${this.schema.name}}`)
    }
}

module.exports = {JavascriptWrapperClassGenerator}