const {JavaTypeGenerator} = require('./JavaTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaVoidTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Void'
    }

    getNativeReturnTypeStatement() {
        return 'void'
    }

    getJsIniRet(nativeIniRet, _context) {
        return IniRet.create().editIni(ini => ini.append(nativeIniRet.initializationCode)
            .__.append(nativeIniRet.returningCode).append(';').newLine())
            .editRet(ret => ret.append('bjs.jsUndefined()'))
    }

    getNativeIniRet(jsIniRet, context, returningFromMethod) {
        return IniRet.create().editIni(ini => ini.append(jsIniRet.initializationCode)
            .__.append(jsIniRet.returningCode).append(';').newLineConditional(!returningFromMethod))
            .editRet(ret => ret.append(returningFromMethod ? null : 'null'))
    }
}

module.exports = {JavaVoidTypeGenerator}