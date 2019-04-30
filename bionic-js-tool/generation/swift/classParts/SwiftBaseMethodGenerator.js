const CodeGeneratorWithClass = require('../../CodeGeneratorWithClass')
const IniRet = require('../../code/IniRet')

class SwiftBaseMethodGenerator extends CodeGeneratorWithClass {

    getParametersGenerators() {
        if (!this._parametersGenerators) {
            this._parametersGenerators = this.schema.parameters.map(par => par.getSwiftGenerator())
        }
        return this._parametersGenerators
    }

    getParametersStatements() {
        return this.getParametersGenerators().map(paramGen => paramGen.getParameterStatement()).join(', ')
    }

    getArgumentsListIniRet(context) {

        const argumentsJsIniRets = this.getParametersGenerators().map(paramGen => paramGen.getJsIniRet(context))

        const argumentsListIniRet = IniRet.create()
        for (let argId = 0; argId < argumentsJsIniRets.length; argId++) {
            const argIniRet = argumentsJsIniRets[argId]
            argumentsListIniRet.appendIni(argIniRet.initializationCode)
            argumentsListIniRet.appendRet(argIniRet.returningCode)
            if (argId < argumentsJsIniRets.length - 1) {
                argumentsListIniRet.appendRet(', ')
            }
        }
        return argumentsListIniRet
    }
}

module.exports = SwiftBaseMethodGenerator