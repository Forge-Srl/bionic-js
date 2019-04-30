const CodeGenerator = require('../../CodeGenerator')
const CodeBlock = require('../../code/CodeBlock')
const IniRet = require('../../code/IniRet')

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

    getNativeReturnStatement() {
        return 'return '
    }

    getJsToPrimitiveMethodName() {
        throw new Error('method "getJsToPrimitiveMethodName" must be implemented')
    }

    getNativeReturnCode(iniRet) {
        return CodeBlock.create()
            .append(iniRet.initializationCode)
            .append(this.getNativeReturnStatement()).append(iniRet.returningCode)
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet('Bjs.get.putPrimitive(').append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`Bjs.get.${this.getJsToPrimitiveMethodName()}(`).append(jsIniRet).appendRet(')')
    }
}

module.exports = SwiftTypeGenerator