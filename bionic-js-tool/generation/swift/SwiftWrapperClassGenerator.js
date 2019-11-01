const {SwiftClassGenerator} = require('./SwiftClassGenerator')
const {Constructor} = require('../../schema/Constructor')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftWrapperClassGenerator extends SwiftClassGenerator {

    constructor(schema, hostClassGenerator) {
        super(schema)
        Object.assign(this, {hostClassGenerator})
    }

    get constructors() {
        const constructors = super.constructors
        if (!constructors.some(part => part instanceof Constructor)) {
            return [new Constructor('Default constructor', [])]
        }
        return constructors
    }

    get classPartsGenerators() {
        if (!this._classPartsGenerators) {
            this._classPartsGenerators = this.getClassParts().map(classPart => classPart.generator.swift.forWrapping(this.schema))
        }
        return this._classPartsGenerators
    }

    getHeaderCode() {
        return CodeBlock.create()
            .append('import JavaScriptCore').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}Wrapper: BjsNativeWrapper {`).newLineIndenting()
            .newLine()
            .append(`override class var name: String { return "${this.schema.name}" }`).newLine()
            .append(`override class var wrapperPath: String { return "${this.schema.moduleLoadingPath}" }`).newLine()
            .newLine()
    }

    getExportFunctionsCode() {
        return CodeBlock.create()
            .append('override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {').newLineIndenting()
            .append('_ = nativeExports').newLineIndenting()
            .append(this.classPartsGenerators.map((generator, index, array) => {
                const newLineIndentation = (index < array.length - 1) ? 0 : -2
                return generator.wrapperExportLines.newLineDeindenting(newLineIndentation)

            }))
            .append('}')
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getExportFunctionsCode()).newLine()
            .newLine()
            .append(this.getClassParts().map((classPart, index, array) => {
                const code = classPart.generator.swift.forWrapping(this.schema).getCode()
                if (index < array.length - 1) {
                    return code.newLine().newLine()
                }
                return code
            }))
            .newLineDeindenting()
    }

    getFooterCode() {
        const footerCode = CodeBlock.create()
            .append('}')

        if (this.hostClassGenerator) {
            footerCode.newLine()
                .newLine()
                .append(`/* ${this.schema.name} class scaffold:`).newLine()
                .newLine()
                .append(this.hostClassGenerator.getScaffold()).newLine()
                .newLine()
                .append('*/')
        }
        return footerCode
    }
}

module.exports = {SwiftWrapperClassGenerator}