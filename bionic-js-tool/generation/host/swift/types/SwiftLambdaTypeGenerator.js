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

    getJsFuncCallWithNativeIniRet(tempJsFuncName) {
        const params = this.schema.parameters

        const callJsIniRet = IniRet.create()
            .appendRet(`Bjs.get.funcCall(${tempJsFuncName}`)

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const paramTypeGenerator = params[paramIndex].getSwiftGenerator()
            callJsIniRet.appendRet(', ').append(paramTypeGenerator.getJsIniRet(`$${paramIndex}`))
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

    getNativeIniRet(jsIniRet) {
        const tempJsFuncName = '__jsFunc'
        const funcCallNativeIniRet = this.getJsFuncCallWithNativeIniRet(tempJsFuncName)
        return IniRet.create()
            .editIni(ini =>
                ini.append(jsIniRet.initializationCode)
                    .append(`let ${tempJsFuncName} = `).append(jsIniRet.returningCode).newLine())
            .editRet(ret =>
                ret.append(`Bjs.get.getFunc(${tempJsFuncName}) {`).newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(funcCallNativeIniRet)).newLineDeindenting()
                    .append('}'))
    }


    getNativeFuncCallWithJsIniRet(funcReturningCode) {
        const params = this.schema.parameters

        const callNativeIniRet = IniRet.create().appendRet(funcReturningCode).appendRet('!(')

        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const paramTypeGenerator = params[paramIndex].getSwiftGenerator()

            const parameterJsIniRet = IniRet.create().appendRet(`$${paramIndex}`)
            callNativeIniRet.append(paramTypeGenerator.getNativeIniRet(parameterJsIniRet))
            if (paramIndex < params.length - 1) {
                callNativeIniRet.appendRet(', ')
            }
        }
        callNativeIniRet.appendRet(')')

        return this.returnTypeGenerator.getJsIniRet(callNativeIniRet)
    }

    /**
     let __func0: @convention(block) (JSValue) -> JSValue = {
                return Bjs.get.putPrimitive(newValue!(Bjs.get.getString($0)))
        }
     RETURN Bjs.get.putFunc(newValue, __func0)

     */

    getJsIniRet(nativeIniRet) {

        const nativeReturningCode = nativeIniRet.returningCode
        const getFuncCallJsIniRet = this.getNativeFuncCallWithJsIniRet(nativeReturningCode)

        const funcNativeRet = `__func${nativeIniRet.getNextUniqueId()}`
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeIniRet.initializationCode)
                    .append(`let ${funcNativeRet}: @convention(block) (`)
                    .__.append(this.schema.parameters.map(param => param.type.getSwiftGenerator().getBlockTypeStatement()).join(', '))
                    .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement())
                    .__.append(' = {').newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(getFuncCallJsIniRet)).newLineDeindenting()
                    .append('}').newLine())

            .editRet(ret =>
                ret.append('Bjs.get.putFunc(').append(nativeReturningCode).append(`, ${funcNativeRet})`))
    }
}

module.exports = SwiftLambdaTypeGenerator