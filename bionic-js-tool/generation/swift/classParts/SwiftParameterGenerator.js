const CodeGenerator = require('../../CodeGenerator')
const IniRet = require('../../code/IniRet')

class SwiftParameterGenerator extends CodeGenerator {

    getParameterStatement() {
        const typeStatement = this.schema.type.getSwiftGenerator().getTypeStatement()
        const typeName = this.schema.name

        return typeName ? `_ ${typeName}: ${typeStatement}` : typeStatement
    }

    getJsIniRet(context) {
        const nativeIniRet = IniRet.create().appendRet(this.schema.name)
        return this.schema.type.getSwiftGenerator().getJsIniRet(nativeIniRet, context)
    }

    getNativeIniRet(context) {
        const jsIniRet = IniRet.create().appendRet(this.schema.name)
        return this.schema.type.getSwiftGenerator().getNativeIniRet(jsIniRet, context)
    }
}

module.exports = SwiftParameterGenerator