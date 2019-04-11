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

    getNativeIniRet(jsIniRet) {
        return jsIniRet
    }

    getJsIniRet(nativeIniRet) {
        return nativeIniRet
    }
}

module.exports = SwiftVoidTypeGenerator