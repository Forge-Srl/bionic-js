const SwiftTypeGenerator = require('./SwiftTypeGenerator')

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

    getNativeIniRet(jsIniRet, context) {
        return jsIniRet
    }

    getJsIniRet(nativeIniRet, context) {
        return nativeIniRet
    }
}

module.exports = SwiftVoidTypeGenerator