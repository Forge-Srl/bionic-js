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

    getJsIniRet(nativeIniRet, context) {
        return nativeIniRet
    }

    getNativeIniRet(jsIniRet, context) {
        return jsIniRet
    }
}

module.exports = {SwiftVoidTypeGenerator}