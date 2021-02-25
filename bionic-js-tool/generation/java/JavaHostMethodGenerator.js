const {JavaMethodGenerator} = require('./JavaMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {IniRet} = require('../code/IniRet')
const {JavaKeywords} = require('./JavaKeywords')

class JavaHostMethodGenerator extends JavaMethodGenerator {

    getHeaderCode() {
        const clazz = this.schema.isStatic ? 'static ' : ''
        const returnTypeStatement = this.returnTypeGenerator.getNativeReturnTypeStatement()

        return CodeBlock.create()
            .append(`public ${clazz}${returnTypeStatement} ${JavaKeywords.getSafeIdentifier(this.schema.name)}(`)
            .__.append(this.getParametersStatements())
            .__.append(') {')
    }

    getBodyCode() {
        const methodContext = new JavaGenerationContext()
        const anyParameter = this.parameters.length
        const returnTypeGen = this.returnTypeGenerator

        const callIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'bjs.call(bjsClass, ' : 'bjsCall(').appendRet(`"${this.schema.name}"`)
            .__.appendRet(anyParameter ? ', ' : '').append(this.getArgumentsListJsIniRet(methodContext)).appendRet(')')
        return returnTypeGen.getNativeReturnCode(returnTypeGen.getNativeIniRet(callIniRet, methodContext, true))

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

module.exports = {JavaHostMethodGenerator}