const {SwiftClassGenerator} = require('./SwiftClassGenerator')
const {Constructor} = require('../../schema/Constructor')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftWrapperClassGenerator extends SwiftClassGenerator {

    constructor(schema, hostClassGenerator) {
        super(schema)
        Object.assign(this, {hostClassGenerator})
    }

    get constructors() {
        return []
    }

    get classPartsGenerators() {
        if (!this._classPartsGenerators) {
            this._classPartsGenerators = this.getClassParts().map(classPart => classPart.generator.swift.forWrapping(this.schema))
        }
        return this._classPartsGenerators
    }

    get hasClassParts() {
        if (!this._hasClassParts) {
            this._hasClassParts = !!this.getClassParts().length
        }
        return this._hasClassParts
    }

    getHeaderCode() {
        const superclassName = this.schema.superclass ? this.schema.superclass.name : 'BjsNative'
        return CodeBlock.create()
            .append('import JavaScriptCore').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}Wrapper: ${superclassName}Wrapper {`).newLineIndenting()
            .newLine()
            .append(`override class var name: String { return "${this.schema.name}" }`).newLine()
            .append(`override class var wrapperPath: String { return "${this.schema.moduleLoadingPath}" }`).newLine()
            .newLine()
    }

    getExportFunctionsCode() {
        return CodeBlock.create()
            .append('override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {').newLineIndenting()
            .append(`return ${this.schema.superclassName ? 'super.bjsExportFunctions(nativeExports)' : 'nativeExports'}`)
            .__.newLineConditional(this.hasClassParts, 1)
            .append(this.classPartsGenerators.map((generator, index, array) => {
                return generator.wrapperExportLines.newLineConditional(index < array.length - 1)
            })).newLine(this.hasClassParts ? -2 : -1)
            .append('}')
    }

    getExportConstructorCode(schema = this.schema) {
        if (!schema.constructors.length) {
            if (schema.superclass) {
                return this.getExportConstructorCode(schema.superclass)
            }
            return new Constructor('Default constructor', []).generator.swift.forWrapping(this.schema, false).getCode()
        }
        return schema.constructors[0].generator.swift.forWrapping(this.schema, true).getCode()
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getExportFunctionsCode()).newLine()
            .newLine()
            .append(this.getExportConstructorCode())
            .append(this.classPartsGenerators.map(classPartGenerator =>
                CodeBlock.create().newLine()
                    .newLine()
                    .append(classPartGenerator.getCode()),
            ))
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