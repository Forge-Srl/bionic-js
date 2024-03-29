const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftLambdaTypeGenerator extends SwiftTypeGenerator {

    get returnTypeGenerator() {
        return this.schema.returnType.generator.swift
    }

    get parameters() {
        return this.schema.parameters
    }

    getTypeStatement() {
        const parametersStatements = this.parameters.map(parameter =>
            parameter.generator.swift.getParameterStatement()).join(', ')
        const returnTypeStatement = this.returnTypeGenerator.getTypeStatement()

        return `((${parametersStatements}) -> ${returnTypeStatement})?`
    }

    getNativeIniRet(jsFuncIniRet, context) {
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        return IniRet.create()
            .editIni(ini =>
                ini.append(jsFuncIniRet.initializationCode)
                    .append(`let ${jsFuncVar} = `).append(jsFuncIniRet.returningCode).newLine())
            .editRet(ret =>
                ret.append(`${context.bjsEntrance}.getFunc(${jsFuncVar}) {`).newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithNativeIniRet(jsFuncVar,
                        context), true))
                    .__.newLineDeindenting()
                    .append('}'))
    }

    getCallerWithNativeIniRet(jsFuncVar, context) {
        const callJsIniRet = IniRet.create()
            .appendRet(`${context.bjsEntrance}.funcCall(${jsFuncVar}`)

        for (let paramIndex = 0; paramIndex < this.parameters.length; paramIndex++) {

            const argumentTypeGenerator = this.parameters[paramIndex].type.generator.swift
            const argumentNativeIniRet = IniRet.create().appendRet(`$${paramIndex}`)

            callJsIniRet.appendRet(', ').append(argumentTypeGenerator.getJsIniRet(argumentNativeIniRet, context))
        }
        callJsIniRet.appendRet(')')

        return this.returnTypeGenerator.getNativeIniRet(callJsIniRet, context)
    }

    getJsIniRet(nativeFuncIniRet, context) {
        const nativeFuncVar = context.getUniqueIdentifier('nativeFunc')
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        const parameters = this.parameters.map(param => param.type.generator.swift.getBlockTypeStatement()).join(', ')
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeFuncIniRet.initializationCode)
                    .append(`let ${nativeFuncVar} = `).append(nativeFuncIniRet.returningCode).newLine()
                    .append(`let ${jsFuncVar}: @convention(block) (`).append(parameters).append(')')
                    .__.append(this.returnTypeGenerator.getBlockReturnTypeStatement()).append(' = {').newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithJsIniRet(nativeFuncVar,
                        context), false)).newLineDeindenting()
                    .append('}').newLine())

            .editRet(ret =>
                ret.append(`${context.bjsEntrance}.putFunc(`).append(nativeFuncVar).append(`, ${jsFuncVar})`))
    }


    getCallerWithJsIniRet(nativeFuncVar, context) {
        const parameterCount = this.parameters.length
        const parametersIniRet = IniRet.create()
        for (let paramIndex = 0; paramIndex < parameterCount; paramIndex++) {

            const argumentTypeGenerator = this.parameters[paramIndex].type.generator.swift
            const argumentJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            parametersIniRet.append(argumentTypeGenerator.getNativeIniRet(argumentJsIniRet, context))

            if (paramIndex < parameterCount - 1) {
                parametersIniRet.appendRet(', ')
            }
        }

        const callIniRet = IniRet.create()
            .editRet(ret => ret.append(`${nativeFuncVar}!(`)).append(parametersIniRet).editRet(ret => ret.append(')'))

        return this.returnTypeGenerator.getJsIniRet(callIniRet, context)
    }
}

module.exports = {SwiftLambdaTypeGenerator}