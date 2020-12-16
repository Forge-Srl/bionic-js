const {JavaJsClassTypeGenerator} = require('./JavaJsClassTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaNativeClassTypeGenerator extends JavaJsClassTypeGenerator {

    getTypeStatement() {
        return `${this.schema.className}BjsExport`
    }

    getJsIniRet(nativeIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.putWrapped(`).append(nativeIniRet).appendRet(`, ${this.getTypeStatement()}.Wrapper.class)`)
    }

    getNativeIniRet(jsIniRet, context) {
        return IniRet.create()
            .appendRet(`${context.bjsEntrance}.getWrapped(`).append(jsIniRet).appendRet(')')
    }
}

module.exports = {JavaNativeClassTypeGenerator}