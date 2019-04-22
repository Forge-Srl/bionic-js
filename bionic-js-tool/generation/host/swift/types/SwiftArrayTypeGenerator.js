const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftArrayTypeGenerator extends SwiftTypeGenerator {

    get elementTypeGenerator() {
        return this.schema.elementType.getSwiftGenerator()
    }

    getTypeStatement() {
        return `[${this.elementTypeGenerator.getTypeStatement()}]?`
    }

    getJsIniRet(nativeIniRet, context) {
        const elementNativeIniRet = IniRet.create().appendRet('$0')
        const elementJsIniRet = this.elementTypeGenerator.getJsIniRet(elementNativeIniRet, context)
        return IniRet.create()
            .editRet(ret =>
                ret.append('Bjs.get.putArray(').append(nativeIniRet.returningCode).append(', {').newLineIndenting()
                    .append(elementJsIniRet.initializationCode)
                    .append('return ').append(elementJsIniRet.returningCode).newLineDeindenting()
                    .append('})'))
            .appendIni(nativeIniRet.initializationCode)
    }

    getNativeIniRet(jsIniRet, context) {
        const elementJsIniRet = IniRet.create().appendRet('$0')
        const elementNativeIniRet = this.elementTypeGenerator.getNativeIniRet(elementJsIniRet, context)
        return IniRet.create()
            .editRet(ret => ret.append('Bjs.get.getArray(').append(jsIniRet.returningCode).append(', {').newLineIndenting()
                .append(elementNativeIniRet.initializationCode)
                .append('return ').append(elementNativeIniRet.returningCode).newLineDeindenting()
                .append('})'))
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = SwiftArrayTypeGenerator