const {SwiftClassGenerator} = require('./SwiftClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftWrapperClassGenerator extends SwiftClassGenerator {

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
            .append(`override class var wrapperPath: String { return "${this.schema.modulePath}" }`).newLine()
            .newLine()
    }

    getExportFunctionsCode() {
        return CodeBlock.create()
            .append('override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {').newLineIndenting()
            .append('_ = nativeExports').newLineIndenting()
            .append(this.classPartsGenerators.map((generator, index, array) => {
                const newLineIndentation = (index < array.length - 1) ? 0 : -2
                return generator.getWrapperExportLine().newLineDeindenting(newLineIndentation)

            }))
            .append('}')
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getExportFunctionsCode())
            .newLine()
            .append(this.getClassParts().map(classPart =>
                classPart.generator.swift.forWrapping(this.schema).getHostCode().newLine()
                    .newLine()))
    }

    getFooterCode() {
        return CodeBlock.create()
            .append('}')
    }
}

module.exports = {SwiftWrapperClassGenerator}