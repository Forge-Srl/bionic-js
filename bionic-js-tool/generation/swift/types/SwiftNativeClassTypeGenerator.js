const {SwiftJsClassTypeGenerator} = require('./SwiftJsClassTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftNativeClassTypeGenerator extends SwiftJsClassTypeGenerator {

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putWrapped(`).append(nativeIniRet)
            .__.appendRet(`, ${this.schema.className}BjsWrapper.self)`)
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getWrapped(`).append(jsIniRet)
            .__.appendRet(`, ${this.schema.className}.self)`)
    }
}

module.exports = {SwiftNativeClassTypeGenerator}