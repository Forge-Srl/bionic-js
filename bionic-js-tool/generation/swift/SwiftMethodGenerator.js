const {CodeGenerator} = require('../CodeGenerator')
const {IniRet} = require('../code/IniRet')

class SwiftMethodGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get parametersGenerators() {
        if (!this._parametersGenerators) {
            this._parametersGenerators = this.schema.parameters.map(par => par.generator.swift)
        }
        return this._parametersGenerators
    }

    getParametersStatements() {
        return this.parametersGenerators.map(paramGen => paramGen.getParameterStatement()).join(', ')
    }

    getArgumentsListIniRet(context) {

        const argumentsJsIniRets = this.parametersGenerators.map(paramGen => paramGen.getJsIniRet(context))

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

module.exports = {SwiftMethodGenerator}