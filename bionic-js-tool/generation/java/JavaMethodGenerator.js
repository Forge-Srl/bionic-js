const {CodeGenerator} = require('../CodeGenerator')
const {IniRet} = require('../code/IniRet')

class JavaMethodGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get parameters() {
        return this.schema.parameters
    }

    get parametersGenerators() {
        if (!this._parametersGenerators) {
            this._parametersGenerators = this.parameters.map(par => par.generator.java)
        }
        return this._parametersGenerators
    }

    get returnTypeGenerator() {
        return this.schema.returnType.generator.java
    }

    getParametersStatements(parametersShift = 0) {
        return this.parametersGenerators.slice(parametersShift)
            .map(paramGen => paramGen.getParameterStatement())
            .join(', ')
    }

    getParametersNamesList(parametersShift = 0) {
        return this.parameters.slice(parametersShift).map(parameter => parameter.name).join(', ')
    }

    getParametersClassesList(parametersShift = 0) {
        return this.parametersGenerators.slice(parametersShift)
            .map(parameter => parameter.getParameterClass())
            .join(', ')
    }

    getArgumentsListJsIniRet(context) {
        const argumentsJsIniRets = this.parametersGenerators.map(paramGen => paramGen.getJsIniRet(context))

        const argumentsListJsIniRet = IniRet.create()
        for (let argId = 0; argId < argumentsJsIniRets.length; argId++) {
            const argJsIniRet = argumentsJsIniRets[argId]
            argumentsListJsIniRet.appendIni(argJsIniRet.initializationCode)
            argumentsListJsIniRet.appendRet(argJsIniRet.returningCode)
            if (argId < argumentsJsIniRets.length - 1) {
                argumentsListJsIniRet.appendRet(', ')
            }
        }
        return argumentsListJsIniRet
    }

    getArgumentsListNativeIniRet(context, parametersShift = 0) {
        const argumentsNativeIniRets = this.parametersGenerators.map(paramGen => paramGen.getNativeIniRet(context))

        const argumentsListNativeIniRet = IniRet.create()
        for (let argId = parametersShift; argId < argumentsNativeIniRets.length; argId++) {
            const argNativeIniRet = argumentsNativeIniRets[argId]
            argumentsListNativeIniRet.appendIni(argNativeIniRet.initializationCode)
            argumentsListNativeIniRet.appendRet(argNativeIniRet.returningCode)
            if (argId < argumentsNativeIniRets.length - 1) {
                argumentsListNativeIniRet.appendRet(', ')
            }
        }
        return argumentsListNativeIniRet
    }
}

module.exports = {JavaMethodGenerator}