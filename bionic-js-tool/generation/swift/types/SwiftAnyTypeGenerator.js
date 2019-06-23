const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftAnyTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'BjsAnyObject'
    }

    getJsToPrimitiveMethodName() {
        return 'getAny'
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create().append(nativeIniRet).appendRet('.jsObj')
    }
}

module.exports = {SwiftAnyTypeGenerator}