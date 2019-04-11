const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftAnyTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'BjsAnyObject?'
    }

    getJsToPrimitiveMethodName() {
        return 'getAny'
    }

    getJsIniRet(nativeIniRet) {
        return IniRet.create()
            .appendRet(`${nativeIniRet.returningCode}.jsObj`)
            .appendIni(nativeIniRet.initializationCode)
    }
}

module.exports = SwiftAnyTypeGenerator