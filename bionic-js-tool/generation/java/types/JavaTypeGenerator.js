const {CodeGenerator} = require('../../CodeGenerator')
const {CodeBlock} = require('../../code/CodeBlock')
const {IniRet} = require('../../code/IniRet')

class JavaTypeGenerator extends CodeGenerator {

    getTypeStatement() {
        throw new Error('method "getTypeStatement" must be implemented')
    }

    getTypeClass() {
        return `${this.getTypeStatement()}.class`
    }

    getNativeReturnTypeStatement() {
        return this.getTypeStatement()
    }

    getJsToPrimitiveMethodName() {
        throw new Error('method "getJsToPrimitiveMethodName" must be implemented')
    }

    getNativeReturnCode(iniRet) {
        let block = CodeBlock.create()
            .append(iniRet.initializationCode)

        if (iniRet.returningCode.codeElements.length > 0) {
            block.append('return ').append(iniRet.returningCode).append(';')
        }

        return block
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putPrimitive(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context, returningFromMethod) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.${this.getJsToPrimitiveMethodName()}(`).append(jsIniRet).appendRet(')')
    }
}

module.exports = {JavaTypeGenerator}