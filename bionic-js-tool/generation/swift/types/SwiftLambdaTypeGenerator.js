const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../code/IniRet')

class SwiftLambdaTypeGenerator extends SwiftTypeGenerator {

    getReturnTypeGenerator() {
        return this.schema.returnType.getSwiftGenerator()
    }

    getTypeStatement() {
        const parametersStatements = this.schema.parameters
            .map(parameter => parameter.getSwiftGenerator().getParameterStatement()).join(', ')
        const returnTypeStatement = this.getReturnTypeGenerator().getTypeStatement()

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
                    .append(this.getReturnTypeGenerator().getNativeReturnCode(this.getCallerWithNativeIniRet(jsFuncVar, context))).newLineDeindenting()
                    .append('}'))
    }

    getCallerWithNativeIniRet(jsFuncVar, context) {
        const params = this.schema.parameters

        const callJsIniRet = IniRet.create()
            .appendRet(`Bjs.get.funcCall(${jsFuncVar}`)

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {

            const argumentTypeGenerator = params[paramIndex].type.getSwiftGenerator()
            const argumentNativeIniRet = IniRet.create().appendRet(`$${paramIndex}`)

            callJsIniRet.appendRet(', ').append(argumentTypeGenerator.getJsIniRet(argumentNativeIniRet, context))
        }
        callJsIniRet.appendRet(')')

        return this.getReturnTypeGenerator().getNativeIniRet(callJsIniRet, context)
    }

    getJsIniRet(nativeFuncIniRet, context) {
        const nativeFuncVar = context.getUniqueIdentifier('nativeFunc')
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeFuncIniRet.initializationCode)
                    .append(`let ${nativeFuncVar} = `).append(nativeFuncIniRet.returningCode).newLine()
                    .append(`let ${jsFuncVar}: @convention(block) (`)
                    .__.append(this.schema.parameters.map(param => param.type.getSwiftGenerator().getBlockTypeStatement()).join(', '))
                    .__.append(')').append(this.getReturnTypeGenerator().getBlockReturnTypeStatement())
                    .__.append(' = {').newLineIndenting()
                    .append(this.getReturnTypeGenerator().getNativeReturnCode(this.getCallerWithJsIniRet(nativeFuncVar, context))).newLineDeindenting()
                    .append('}').newLine())

            .editRet(ret =>
                ret.append('Bjs.get.putFunc(').append(nativeFuncVar).append(`, ${jsFuncVar})`))
    }


    getCallerWithJsIniRet(nativeFuncVar, context) {
        const params = this.schema.parameters

        const parametersIniRet = IniRet.create()
        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {

            const argumentTypeGenerator = params[paramIndex].type.getSwiftGenerator()
            const argumentJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            parametersIniRet.append(argumentTypeGenerator.getNativeIniRet(argumentJsIniRet, context))

            if (paramIndex < params.length - 1) {
                parametersIniRet.appendRet(', ')
            }
        }

        const callIniRet = IniRet.create()
            .editRet(ret => ret.append(`${nativeFuncVar}!(`)).append(parametersIniRet).editRet(ret => ret.append(')'))

        return this.getReturnTypeGenerator().getJsIniRet(callIniRet, context)
    }
}

module.exports = SwiftLambdaTypeGenerator