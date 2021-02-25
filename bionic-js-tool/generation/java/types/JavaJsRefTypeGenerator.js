const {JavaTypeGenerator} = require('./JavaTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaJsRefTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'BjsAnyObject'
    }

    getJsToPrimitiveMethodName() {
        return 'getAny'
    }

    getJsIniRet(nativeIniRet, _context) {
        return IniRet.create().append(nativeIniRet).appendRet('.jsObj')
    }
}

module.exports = {JavaJsRefTypeGenerator}