const HostGenerator = require('../HostGenerator')
const IniRet = require('../../code/IniRet')

class SwiftParameterGenerator extends HostGenerator {

    getParameterStatement() {
        return `_ ${this.schema.name}: ${this.schema.type.getSwiftGenerator().getTypeStatement()}`
    }

    getJsIniRet(context) {
        const nativeIniRet = IniRet.create().appendRet(this.schema.name)
        return this.schema.type.getSwiftGenerator().getJsIniRet(nativeIniRet, context)
    }
}

module.exports = SwiftParameterGenerator