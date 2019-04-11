const SwiftObjectTypeGenerator = require('./SwiftObjectTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftNativeObjectTypeGenerator extends SwiftObjectTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}?`
    }

    getJsIniRet(nativeIniRet) {
        return IniRet.create()
            .appendRet('Bjs.get.putWrapped(').append(nativeIniRet).appendRet(`, ${this.schema.className}.self)`)
    }

    getNativeIniRet(jsIniRet) {
        return IniRet.create()
            .appendRet('Bjs.get.getWrapped(').append(jsIniRet.returningCode).appendRet(`, ${this.schema.className}.self)`)
    }
}

module.exports = SwiftNativeObjectTypeGenerator