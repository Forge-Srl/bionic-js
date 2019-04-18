const SwiftTypeGenerator = require('./SwiftTypeGenerator')
const IniRet = require('../../../code/IniRet')
const BlockContext = require('../../../code/GenerationContext')

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

    getCallerWithNativeIniRet(jsFunctionVariable) {
        const callerContext = new BlockContext()
        const params = this.schema.parameters

        const callJsIniRet = IniRet.create()
            .appendRet(`Bjs.get.funcCall(${jsFunctionVariable}`)

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const paramTypeGenerator = params[paramIndex].getSwiftGenerator()
            callJsIniRet.appendRet(', ').append(paramTypeGenerator.getJsIniRet(IniRet.create().appendRet(`$${paramIndex}`), callerContext))
        }
        callJsIniRet.appendRet(')')

        return this.returnTypeGenerator.getNativeIniRet(callJsIniRet)
    }

    /**
     let __jsFunc0 = bjsGetProperty("lambdaAutoProp")
     RETURN Bjs.get.getFunc(__jsFunc0) {
            return Bjs.get.getString(Bjs.get.funcCall(__jsFunc0, $0))
        }
     */

    getNativeIniRet(jsIniRet, context) {
        const jsFunctionVar = '__jsFunc'
        return IniRet.create()
            .editIni(ini =>
                ini.append(jsIniRet.initializationCode)
                    .append(`let ${jsFunctionVar} = `).append(jsIniRet.returningCode).newLine())
            .editRet(ret =>
                ret.append(`Bjs.get.getFunc(${jsFunctionVar}) {`).newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithNativeIniRet(jsFunctionVar))).newLineDeindenting()
                    .append('}'))
    }


    getCallerWithJsIniRet(nativeFunctionReturningCode) {
        const params = this.schema.parameters

        const callerNativeIniRet = IniRet.create().appendRet(nativeFunctionReturningCode).appendRet('!(')

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const paramTypeGenerator = params[paramIndex].getSwiftGenerator()

            const parameterJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            callerNativeIniRet.append(paramTypeGenerator.getNativeIniRet(parameterJsIniRet))
            if (paramIndex < params.length - 1) {
                callerNativeIniRet.appendRet(', ')
            }
        }
        callerNativeIniRet.appendRet(')')

        return this.returnTypeGenerator.getJsIniRet(callerNativeIniRet)
    }

    /**
     let __func0: @convention(block) (JSValue) -> JSValue = {
                return Bjs.get.putPrimitive(newValue!(Bjs.get.getString($0)))
        }
     RETURN Bjs.get.putFunc(newValue, __func0)

     */

    getJsIniRet(nativeIniRet, context) {

        const nativeReturningCode = nativeIniRet.returningCode

        const nativeFunctionVar = `_bjsNativeFunc${context.getNextUniqueId()}`
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeIniRet.initializationCode)
                    .append(`let ${nativeFunctionVar}: @convention(block) (`)
                    .__.append(this.schema.parameters.map(param => param.type.getSwiftGenerator().getBlockTypeStatement()).join(', '))
                    .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement())
                    .__.append(' = {').newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithJsIniRet(nativeReturningCode))).newLineDeindenting()
                    .append('}').newLine())

            .editRet(ret =>
                ret.append('Bjs.get.putFunc(').append(nativeReturningCode).append(`, ${nativeFunctionVar})`))
    }
}

module.exports = SwiftLambdaTypeGenerator