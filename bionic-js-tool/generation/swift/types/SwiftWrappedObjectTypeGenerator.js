const SwiftObjectTypeGenerator = require('./SwiftObjectTypeGenerator')
const IniRet = require('../../code/IniRet')

class SwiftWrappedObjectTypeGenerator extends SwiftObjectTypeGenerator {

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet('Bjs.get.putWrapped(').append(nativeIniRet).appendRet(`, ${this.schema.className}Wrapper.self)`)
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet('Bjs.get.getWrapped(').append(jsIniRet).appendRet(`, ${this.schema.className}.self)`)
    }
}

module.exports = SwiftWrappedObjectTypeGenerator