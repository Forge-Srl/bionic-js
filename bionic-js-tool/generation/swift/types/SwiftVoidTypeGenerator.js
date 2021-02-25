const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')

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

    getNativeReturnStatement(alwaysReturningCode) {
        return alwaysReturningCode ? '_ = ' : ''
    }

    getJsIniRet(nativeIniRet, _context) {
        return nativeIniRet
    }

    getNativeIniRet(jsIniRet, _context) {
        return jsIniRet
    }
}

module.exports = {SwiftVoidTypeGenerator}