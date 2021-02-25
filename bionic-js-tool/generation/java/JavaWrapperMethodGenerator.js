const {JavaMethodGenerator} = require('./JavaMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {IniRet} = require('../code/IniRet')
const {NativeClassType} = require('../../schema/types/NativeClassType')
const {Parameter} = require('../../schema/Parameter')
const {VoidType} = require('../../schema/types/VoidType')

class JavaWrapperMethodGenerator extends JavaMethodGenerator {

    get wrapperExportLines() {
        return CodeBlock.create()
            .append(`.exportFunction("${this.wrapperMethodName}", singleton.${this.wrapperMethodName}())`)
    }

    get wrapperMethodName() {
        if (!this._wrapperMethodName) {
            const staticMod = this.schema.isStatic ? 'Static' : ''
            this._wrapperMethodName = `bjs${staticMod}_${this.schema.name}`
        }
        return this._wrapperMethodName
    }

    get parametersIndexShift() {
        return this.schema.isStatic ? 0 : 1
    }

    get parameters() {
        const firstParameter = this.schema.isStatic ? [] : [new Parameter(new NativeClassType(), 'wrappedObj')]

        const otherParameters = super.parameters.map((parameter, index) =>
            new Parameter(parameter.type, `jsReferences[${index + this.parametersIndexShift}]`, parameter.description))

        return [...firstParameter, ...otherParameters]
    }

    getInterfaceDeclaration() {
        if (this.schema.isStatic) {
            return null
        }

        const parameters = this.schema.parameters
            .map(par => par.generator.java)
            .map(paramGen => paramGen.getParameterStatement()).join(', ')
        return `${this.returnTypeGenerator.getNativeReturnTypeStatement()} ${this.schema.name}(${parameters});`
    }

    getNativeMethodCall(argumentTypes, argumentsListNativeIniRet, context) {
        const iniRet = IniRet.create()
            .appendIni(argumentsListNativeIniRet.initializationCode)

        if (this.schema.isStatic) {
            if (this.schema.returnType instanceof VoidType) {
                iniRet
                    .editRet(ret => ret
                        .append(`invokeStatic("${this.schema.name}", new Class[]{${argumentTypes}}, new Object[]{`)
                        .__.append(argumentsListNativeIniRet.returningCode).append('})'))
            } else {
                const tempVar = context.getUniqueIdentifier('result')
                const typeStatement = this.returnTypeGenerator.getTypeStatement()
                iniRet
                    .editIni(ini => ini
                        .append(`${typeStatement} ${tempVar} = invokeStatic("${this.schema.name}", new Class[]{${argumentTypes}}, new Object[]{`)
                        .__.append(argumentsListNativeIniRet.returningCode).append('});').newLine())
                    .appendRet(tempVar)
            }
        } else {
            iniRet
                .editRet(ret => ret
                    .append(`((${this.classSchema.name}BjsExport) bjs.getWrapped(jsReferences[0])).${this.schema.name}(`)
                    .__.append(argumentsListNativeIniRet.returningCode).append(')'))
        }
        return iniRet
    }

    getCode() {
        const methodContext = new JavaGenerationContext()
        const argumentsListNativeIniRet = this.getArgumentsListNativeIniRet(methodContext, this.parametersIndexShift)
        const callIniRet = this.getNativeMethodCall(this.getParametersClassesList(this.parametersIndexShift),
            argumentsListNativeIniRet, methodContext)
        const lambdaReturnTypeGen = this.returnTypeGenerator
        const lambdaCode = lambdaReturnTypeGen
            .getNativeReturnCode(lambdaReturnTypeGen.getJsIniRet(callIniRet, methodContext), false)

        return CodeBlock.create()
            .append(`protected FunctionCallback<?> ${this.wrapperMethodName}() {`).newLineIndenting()
            .append('return jsReferences -> {').newLineIndenting()
            .append(lambdaCode).newLineDeindenting()
            .append('};').newLineDeindenting()
            .append('}')
    }
}

module.exports = {JavaWrapperMethodGenerator}