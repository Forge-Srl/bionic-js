const {JavaTypeGenerator} = require('./JavaTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaJsClassTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}`
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putObj(`).append(nativeIniRet).appendRet(')')
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getObj(`).appendRet(jsIniRet.returningCode).appendRet(`, ${this.schema.className}.bjsFactory, ${this.schema.className}.class)`)
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = {JavaJsClassTypeGenerator}