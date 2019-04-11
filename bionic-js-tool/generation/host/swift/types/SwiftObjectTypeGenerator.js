const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftObjectTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}?`
    }

    getJsIniRet(nativeIniRet) {
        return new IniRet()
            .appendRet('Bjs.get.putObj(').append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet) {
        return new IniRet()
            .appendRet('Bjs.get.getObj(').appendRet(jsIniRet.returningCode).appendRet(`, ${this.schema.className}.bjsFactory)`)
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = SwiftObjectTypeGenerator