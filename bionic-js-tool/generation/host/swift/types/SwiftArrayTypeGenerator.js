const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftArrayTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return `[${this.schema.elementType.getSwiftGenerator().getTypeStatement()}]?`
    }

    getJsIniRet(nativeIniRet, context) {
        const elementNativeIniRet = IniRet.create().appendRet('$0')
        const elementJsIniRet = this.schema.elementType.getJsIniRet(elementNativeIniRet)
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
        const elementNativeIniRet = this.schema.elementType.getNativeIniRet(elementJsIniRet)
        return IniRet.create()
            .editRet(ret => ret.append('Bjs.get.getArray(').append(jsIniRet.returningCode).append(', {').newLineIndenting()
                .append(elementNativeIniRet.initializationCode)
                .append('return ').append(elementNativeIniRet.returningCode).newLineDeindenting()
                .append('})'))
            .appendIni(jsIniRet.initializationCode)
    }
}

module.exports = SwiftArrayTypeGenerator