const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftVoidTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'Void'
    }

    getBlockReturnTypeStatement() {
        return ' -> Void'
    }

    getNativeReturnTypeStatement() {
        return ''
    }

    getNativeReturnStatement() {
        return '_ = '
    }

    getJsIniRet(nativeIniRet, context) {
        return nativeIniRet
    }

    getNativeIniRet(jsIniRet, context) {
        return jsIniRet
    }
}

module.exports = SwiftVoidTypeGenerator