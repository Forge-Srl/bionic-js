const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')

class SwiftLambdaTypeGenerator extends SwiftTypeGenerator {

    get returnTypeGenerator() {
        return this.schema.returnType.getSwiftGenerator()
    }

    getTypeStatement() {
        const parameterTypes = this.schema.parameters
            .map(parameter => parameter.getSwiftGenerator().getParameterStatement())
            .join(', ')
        const returnType = this.returnTypeGenerator.getTypeStatement()
        return `((${parameterTypes}) -> ${returnType})?`
    }

    getCallResultIniRet(callIniRet, context) {
        const retValueVariable = context.getUniqueIdentifier('callRetValue')
        return IniRet.create()
            .editIni(ini => ini
                .append(callIniRet.initializationCode)
                .append(`let ${retValueVariable} = `).append(callIniRet.returningCode).newLine())
            .appendRet(retValueVariable)
    }


    /** JS LAMBDA -> NATIVE LAMBDA */

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

            const argumentTypeGenerator = params[paramIndex].type.getSwiftGenerator()
            const argumentNativeIniRet = IniRet.create().appendRet(`$${paramIndex}`)

            callJsIniRet.appendRet(', ').append(argumentTypeGenerator.getJsIniRet(argumentNativeIniRet, context))
        }
        callJsIniRet.appendRet(')')

        return this.returnTypeGenerator.getNativeIniRet(callJsIniRet, context)
    }

    /** *******************************/

    /** NATIVE LAMBDA -> JS LAMBDA */

    getJsIniRet(nativeFuncIniRet, context) {
        const nativeFuncVar = context.getUniqueIdentifier('nativeFunc')
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeFuncIniRet.initializationCode)
                    .append(`let ${nativeFuncVar} = `).append(nativeFuncIniRet.returningCode).newLine()
                    .append(`let ${jsFuncVar}: @convention(block) (`)
                    .__.append(this.schema.parameters.map(param => param.type.getSwiftGenerator().getBlockTypeStatement()).join(', '))
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

            const argumentTypeGenerator = params[paramIndex].type.getSwiftGenerator()
            const argumentJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            parametersIniRet.append(argumentTypeGenerator.getNativeIniRet(argumentJsIniRet, context))

            if (paramIndex < params.length - 1) {
                parametersIniRet.appendRet(', ')
            }
        }

        const callIniRet = IniRet.create()
            .editRet(ret => ret.append(`${nativeFuncVar}!(`)).append(parametersIniRet).editRet(ret => ret.append(')'))

        //const callResultIniRet = this.returnTypeGenerator.getCallResultIniRet(callIniRet, context)
        return this.returnTypeGenerator.getJsIniRet(callIniRet, context)
    }

    /** *******************************/
}

module.exports = SwiftLambdaTypeGenerator