const {ClassGenerator} = require('../ClassGenerator')
const {Constructor} = require('../../schema/Constructor')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftWrapperClassGenerator extends ClassGenerator {

    constructor(schema, hostClassGenerator, projectName) {
        super(schema)
        Object.assign(this, {hostClassGenerator, projectName})
    }

    get constructors() {
        return []
    }

    get classPartsGenerators() {
        if (!this._classPartsGenerators) {
            this._classPartsGenerators = this.getClassParts().map(classPart => classPart.generator.forWrapping(this.schema).swift)
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
        const superclassName = this.schema.superclass ? `${this.schema.superclass.name}BjsWrapper` : 'BjsNativeWrapper'
        return CodeBlock.create()
            .append('import JavaScriptCore').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}BjsWrapper: ${superclassName} {`).newLineIndenting()
            .newLine()
    }

    getExportFunctionsCode() {
        return CodeBlock.create()
            .append('override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {').newLineIndenting()
            .append(`return ${this.schema.superclass ? 'super.bjsExportFunctions(nativeExports)' : 'nativeExports'}`)
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
            return new Constructor('Default constructor', []).generator.forWrapping(this.schema, false).swift.getCode()
        }
        return schema.constructors[0].generator.forWrapping(this.schema, true).swift.getCode()
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
            .newLine()
    }

    getFooterCode() {
        const footerCode = CodeBlock.create().newLine()
            .append(`private static var _bjsLocator: BjsLocator = BjsLocator("${this.projectName}", "${this.schema.name}")`)
            .__.newLine()
            .append(`override class var bjsLocator: BjsLocator { _bjsLocator }`).newLineDeindenting()
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