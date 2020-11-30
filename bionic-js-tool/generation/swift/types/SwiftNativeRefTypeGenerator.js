const {SwiftJsClassTypeGenerator} = require('./SwiftJsClassTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftNativeRefTypeGenerator extends SwiftJsClassTypeGenerator {

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putNative(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getNative(`).append(jsIniRet).appendRet(`, ${this.schema.className}.self)`)
    }
}

module.exports = {SwiftNativeRefTypeGenerator}