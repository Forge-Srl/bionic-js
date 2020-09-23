const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostClassGenerator extends ClassGenerator {

    getHeaderCode() {
        const superclassName = this.schema.superclass.isBaseObjectClass ? 'BjsObject' : this.schema.superclass.name

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
                classPart.generator.forHosting(this.schema).swift.getCode().newLine()
                    .newLine()))
    }

    getFooterCode() {
        const override = this.schema.superclass.isBaseObjectClass ? '' : 'override '

        return CodeBlock.create()
            .append(`${override}class func bjsFactory(_ jsObject: JSValue) -> ${this.schema.name} {`).newLineIndenting()
            .append(`return ${this.schema.name}(jsObject)`).newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append('override class var bjsModulePath: String {').newLineIndenting()
            .append(`return "${this.schema.moduleLoadingPath}"`).newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        const superclassName = this.schema.superclass.isBaseObjectClass || this.schema.superclass.isNativeObjectClass
            ? 'BjsExport' : this.schema.superclass.name
        const scaffoldCode = CodeBlock.create()
            .append('import Bjs').newLine()
            .newLine()
            .append(`class ${this.schema.name}: ${superclassName} {`).newLineIndenting()

        const classParts = this.getClassParts()
        if (classParts.length)
            scaffoldCode.newLine()

        return scaffoldCode.append(classParts.map((classPart, index) => {
            const classPartCode = classPart.generator.forHosting(this.schema).swift.getScaffold()
            if (index < classParts.length - 1) {
                classPartCode.newLine().newLine()
            }
            return classPartCode
        }))
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostClassGenerator}