const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class SwiftLambdaTypeGenerator extends SwiftTypeGenerator {

    get returnTypeGenerator() {
        return this.schema.returnType.generator.swift
    }

    getTypeStatement() {
        const parametersStatements = this.schema.parameters
            .map(parameter => parameter.generator.swift.getParameterStatement()).join(', ')
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
                ret.append(`Bjs.get.getFunc(${jsFuncVar}) {`).newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithNativeIniRet(jsFuncVar, context))).newLineDeindenting()
                    .append('}'))
    }

    getCallerWithNativeIniRet(jsFuncVar, context) {
        const params = this.schema.parameters

        const callJsIniRet = IniRet.create()
            .appendRet(`Bjs.get.funcCall(${jsFuncVar}`)

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {

            const argumentTypeGenerator = params[paramIndex].type.generator.swift
            const argumentNativeIniRet = IniRet.create().appendRet(`$${paramIndex}`)

            callJsIniRet.appendRet(', ').append(argumentTypeGenerator.getJsIniRet(argumentNativeIniRet, context))
        }
        callJsIniRet.appendRet(')')

        return this.returnTypeGenerator.getNativeIniRet(callJsIniRet, context)
    }

    getJsIniRet(nativeFuncIniRet, context) {
        const nativeFuncVar = context.getUniqueIdentifier('nativeFunc')
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeFuncIniRet.initializationCode)
                    .append(`let ${nativeFuncVar} = `).append(nativeFuncIniRet.returningCode).newLine()
                    .append(`let ${jsFuncVar}: @convention(block) (`)
                    .__.append(this.schema.parameters.map(param => param.type.generator.swift.getBlockTypeStatement()).join(', '))
                    .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement())
                    .__.append(' = {').newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithJsIniRet(nativeFuncVar, context))).newLineDeindenting()
                    .append('}').newLine())

            .editRet(ret =>
                ret.append('Bjs.get.putFunc(').append(nativeFuncVar).append(`, ${jsFuncVar})`))
    }


    getCallerWithJsIniRet(nativeFuncVar, context) {
        const params = this.schema.parameters

        const parametersIniRet = IniRet.create()
        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {

            const argumentTypeGenerator = params[paramIndex].type.generator.swift
            const argumentJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            parametersIniRet.append(argumentTypeGenerator.getNativeIniRet(argumentJsIniRet, context))

            if (paramIndex < params.length - 1) {
                parametersIniRet.appendRet(', ')
            }
        }

        const callIniRet = IniRet.create()
            .editRet(ret => ret.append(`${nativeFuncVar}!(`)).append(parametersIniRet).editRet(ret => ret.append(')'))

        return this.returnTypeGenerator.getJsIniRet(callIniRet, context)
    }
}

module.exports = {SwiftLambdaTypeGenerator}