const SwiftObjectTypeGenerator = require('./SwiftObjectTypeGenerator')
const IniRet = require('../../../code/IniRet')
const CodeBlock = require('../../../code/CodeBlock')

class SwiftNativeObjectTypeGenerator extends SwiftObjectTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}?`
    }

    getJsIniRet(nativeIniRet) {
        return IniRet.create()
            .appendRet('Bjs.get.putNative(').append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet) {
        return IniRet.create()
            .appendRet('Bjs.get.getNative(')
        return new IniRet(
            CodeBlock.create().append('Bjs.get.getNative(').append(jsIniRet.returningCode).append(`, ${this.schema.className}.self)`),
            jsIniRet.initializationCode)
    }
}

module.exports = SwiftNativeObjectTypeGenerator