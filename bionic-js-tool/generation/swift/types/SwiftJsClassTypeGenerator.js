const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftJsClassTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}?`
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putObj(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getObj(`).appendRet(jsIniRet.returningCode).appendRet(`, ${this.schema.className}.bjsFactory)`)
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = {SwiftJsClassTypeGenerator}