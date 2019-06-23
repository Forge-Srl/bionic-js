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

    /*

    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {
        _ = nativeExports
            .exportFunction("bjsStaticGet_pi", bjsStaticGet_pi())
            .exportFunction("bjsStatic_sum", bjsStatic_sum())
            .exportBindFunction(bjsBind())
            .exportFunction("bjsGet_number1", bjsGet_number1())
            .exportFunction("bjsSet_number1", bjsSet_number1())
            .exportFunction("bjsGet_number2", bjsGet_number2())
            .exportFunction("bjsSet_number2", bjsSet_number2())
            .exportFunction("bjs_getSum", bjs_getSum())
            .exportFunction("bjs_getToySum", bjs_getToySum())
    }

     */
    getExportFunctionsCode() {
        return CodeBlock.create()
            .append('override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {').newLineIndenting()
            .append('_ = nativeExports').newLineIndenting()
            .append(this.classPartsGenerators.map(generator => generator.getExportFunctionCode())).newLineDeindenting(-2)
            .append('}')
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getExportFunctionsCode())
            .newLine()
            .append(this.getClassParts().map(classPart =>
                classPart.generator.swift.forWrapping(this.schema).getImplementation().newLine()
                    .newLine()))
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

module.exports = {SwiftWrapperClassGenerator}