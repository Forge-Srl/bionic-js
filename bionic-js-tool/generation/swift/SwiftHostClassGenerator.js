const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostClassGenerator extends ClassGenerator {

    constructor(schema, projectName) {
        super(schema)
        Object.assign(this, {projectName})
    }

    getHeaderCode() {
        const superclassName = this.schema.superclass ? this.schema.superclass.name : 'BjsObject'

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
        const override = this.schema.superclass ? 'override ' : ''

        return CodeBlock.create()
            .append(`private static var _bjsLocator: BjsLocator = BjsLocator("${this.projectName}", "${this.schema.name}")`)
            .__.newLine()
            .append('override class var bjsLocator: BjsLocator { _bjsLocator }').newLine()
            .append(`${override}class func bjsFactory(_ jsObject: JSValue) -> ${this.schema.name} { ${this.schema.name}(jsObject) }`)
            .__.newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        const superclassName = this.schema.superclass ? this.schema.superclass.name : 'BjsExport'
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