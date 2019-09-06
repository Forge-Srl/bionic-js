const {SwiftClassGenerator} = require('./SwiftClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostClassGenerator extends SwiftClassGenerator {

    getHeaderCode() {
        const superclassName = this.schema.superclassName || 'BjsObject'

        return CodeBlock.create()
            .append('import JavaScriptCore').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}: ${superclassName} {`).newLineIndenting()
            .newLine()
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getClassParts().map(classPart =>
                classPart.generator.swift.forHosting(this.schema).getCode().newLine()
                    .newLine()))
    }

    getFooterCode() {
        const override = !!this.schema.superclassName ? 'override ' : ''

        return CodeBlock.create()
            .append(`${override}class func bjsFactory(_ jsObject: JSValue) -> ${this.schema.name} {`).newLineIndenting()
            .append(`return ${this.schema.name}(jsObject)`).newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append('override class var bjsModulePath: String {').newLineIndenting()
            .append(`return "${this.schema.modulePath}"`).newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostClassGenerator}