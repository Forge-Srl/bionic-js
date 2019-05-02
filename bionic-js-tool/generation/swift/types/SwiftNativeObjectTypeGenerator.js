const SwiftObjectTypeGenerator = require('./SwiftObjectTypeGenerator')
const IniRet = require('../../code/IniRet')

class SwiftNativeObjectTypeGenerator extends SwiftObjectTypeGenerator {

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet('Bjs.get.putNative(').append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet('Bjs.get.getNative(').append(jsIniRet).appendRet(`, ${this.schema.className}.self)`)
    }
}

module.exports = SwiftNativeObjectTypeGenerator