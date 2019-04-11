const HostGenerator = require('../HostGenerator')
const IniRet = require('../../code/IniRet')

class SwiftParameterGenerator extends HostGenerator {

    getParameterStatement() {
        return `_ ${this.schema.name}: ${this.schema.type.getSwiftGenerator().getTypeStatement()}`
    }

    getJsIniRet(blockContext) {
        const nativeIniRet = IniRet.create(blockContext).appendRet(this.schema.name)
        return this.schema.type.getSwiftGenerator().getJsIniRet(nativeIniRet)
    }
}

module.exports = SwiftParameterGenerator