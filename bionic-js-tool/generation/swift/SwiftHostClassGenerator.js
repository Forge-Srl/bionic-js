const SwiftClassGenerator = require('./SwiftClassGenerator')
const CodeBlock = require('../code/CodeBlock')
const CodeFile = require('../CodeFile')

class SwiftHostClassGenerator extends SwiftClassGenerator {

    getFiles() {
        const code = CodeBlock.create()
            .append(this.getHeaderCode())
            .append(this.getPartsCode(this.staticProperties))
            .append(this.getPartsCode(this.staticMethods))
            .append(this.getPartsCode(this.constructors))
            .append(this.getPartsCode(this.instanceProperties))
            .append(this.getPartsCode(this.instanceMethods))
            .append(this.getFooterCode())

        return [new CodeFile(this.schema.name + '.swift', code.getString())]
    }

    getHeaderCode() {
        const superClassName = this.schema.superClassName || 'BjsClass'

        return CodeBlock.create()
            .append('import JavaScriptCore').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}: ${superClassName} {`).newLineIndenting()
            .newLine()
    }

    getPartsCode(parts) {
        const code = CodeBlock.create()
        parts.map(classPart => classPart.generator.swift.forHosting(this.schema)).forEach(generator => code.append(
            generator.getImplementation()).newLine()
            .newLine())
        return code
    }

    getFooterCode() {
        const override = !!this.schema.superClassName ? 'override ' : ''

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

module.exports = SwiftHostClassGenerator