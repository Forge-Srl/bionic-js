const {JavaTypeGenerator} = require('./JavaTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaArrayTypeGenerator extends JavaTypeGenerator {

    get elementTypeGenerator() {
        return this.schema.elementType.generator.java
    }

    getTypeStatement() {
        return `${this.elementTypeGenerator.getTypeStatement()}[]`
    }

    getJsIniRet(nativeIniRet, context) {
        const paramName = context.getUniqueIdentifier('nv')

        const elementNativeIniRet = IniRet.create().appendRet(paramName)
        const elementJsIniRet = this.elementTypeGenerator.getJsIniRet(elementNativeIniRet, context)
        return IniRet.create()
            .editRet(ret =>
                ret.append(`${context.bjsEntrance}.putArray(`).append(nativeIniRet.returningCode).append(`, ${paramName} -> {`).newLineIndenting()
                    .append(elementJsIniRet.initializationCode)
                    .append('return ').append(elementJsIniRet.returningCode).append(';').newLineDeindenting()
                    .append('})'))
            .appendIni(nativeIniRet.initializationCode)
    }

    getNativeIniRet(jsIniRet, context) {
        const paramName = context.getUniqueIdentifier('r')

        const elementJsIniRet = IniRet.create().appendRet(paramName)
        const elementNativeIniRet = this.elementTypeGenerator.getNativeIniRet(elementJsIniRet, context, false)
        return IniRet.create()
            .editRet(ret => ret.append(`${context.bjsEntrance}.getArray(`).append(jsIniRet.returningCode).append(`, ${paramName} -> {`).newLineIndenting()
                .append(elementNativeIniRet.initializationCode)
                .append('return ').append(elementNativeIniRet.returningCode).append(';').newLineDeindenting()
                .append('}, ').append(this.elementTypeGenerator.getTypeStatement()).append('.class)'))
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = {JavaArrayTypeGenerator}