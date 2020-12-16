const {JavaJsClassTypeGenerator} = require('./JavaJsClassTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaNativeRefTypeGenerator extends JavaJsClassTypeGenerator {

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putNative(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getNative(`).append(jsIniRet).appendRet(')')
    }
}

module.exports = {JavaNativeRefTypeGenerator}