const {CodeGenerator} = require('../CodeGenerator')
const {IniRet} = require('../code/IniRet')

class JavaParameterGenerator extends CodeGenerator {

    get typeGenerator() {
        return this.schema.type.generator.java
    }

    getParameterStatement() {
        const typeStatement = this.typeGenerator.getTypeStatement()
        const parameterName = this.schema.name

        return `${typeStatement} ${parameterName}`
    }

    getParameterClass() {
        return this.typeGenerator.getTypeClass()
    }

    getJsIniRet(context) {
        const nativeIniRet = IniRet.create().appendRet(this.schema.name)
        return this.typeGenerator.getJsIniRet(nativeIniRet, context)
    }

    getNativeIniRet(context) {
        const jsIniRet = IniRet.create().appendRet(this.schema.name)
        return this.typeGenerator.getNativeIniRet(jsIniRet, context, false)
    }
}

module.exports = {JavaParameterGenerator}