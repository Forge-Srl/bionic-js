const {CodeGenerator} = require('../../CodeGenerator')
const {CodeBlock} = require('../../code/CodeBlock')
const {IniRet} = require('../../code/IniRet')

class SwiftTypeGenerator extends CodeGenerator {

    getTypeStatement() {
        throw new Error('method "getTypeStatement" must be implemented')
    }

    getBlockTypeStatement() {
        return 'JSValue'
    }

    getBlockReturnTypeStatement() {
        return ' -> JSValue'
    }

    getNativeReturnTypeStatement() {
        return ` -> ${this.getTypeStatement()}`
    }

    getNativeReturnStatement(_alwaysReturningCode) {
        return 'return '
    }

    getJsToPrimitiveMethodName() {
        throw new Error('method "getJsToPrimitiveMethodName" must be implemented')
    }

    getNativeReturnCode(iniRet, alwaysReturningCode) {
        return CodeBlock.create()
            .append(iniRet.initializationCode)
            .append(this.getNativeReturnStatement(alwaysReturningCode)).append(iniRet.returningCode)
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putPrimitive(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.${this.getJsToPrimitiveMethodName()}(`).append(jsIniRet).appendRet(')')
    }
}

module.exports = {SwiftTypeGenerator}