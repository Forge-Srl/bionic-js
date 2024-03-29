const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {SwiftGenerationContext} = require('./SwiftGenerationContext')
const {IniRet} = require('../code/IniRet')
const {SwiftKeywords} = require('./SwiftKeywords')

class SwiftHostMethodGenerator extends SwiftMethodGenerator {

    getHeaderCode() {
        const clazz = this.schema.isStatic ? 'class ' : ''
        const returnTypeStatement = this.returnTypeGenerator.getNativeReturnTypeStatement()

        return CodeBlock.create()
            .append(`${clazz}func ${SwiftKeywords.getSafeIdentifier(this.schema.name)}(`)
            .__.append(this.getParametersStatements()).append(`)${returnTypeStatement} {`)
    }

    getBodyCode() {
        const methodContext = new SwiftGenerationContext(this.schema.isStatic ? null : this.classSchema.name)
        const anyParameter = this.parameters.length
        const returnTypeGen = this.returnTypeGenerator

        const callIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'bjs.call(self.bjsClass, ' : 'bjsCall(').appendRet(`"${this.schema.name}"`)
            .__.appendRet(anyParameter ? ', ' : '').append(this.getArgumentsListJsIniRet(methodContext)).appendRet(')')
        return returnTypeGen.getNativeReturnCode(returnTypeGen.getNativeIniRet(callIniRet, methodContext), true)

    }

    getCode() {
        return this.getHeaderCode().newLineIndenting()
            .append(this.getBodyCode()).newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        return this.getHeaderCode().newLineIndenting()
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostMethodGenerator}