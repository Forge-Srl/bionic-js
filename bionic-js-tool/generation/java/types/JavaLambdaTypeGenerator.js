const {JavaTypeGenerator} = require('./JavaTypeGenerator')
const {IniRet} = require('../../code/IniRet')

class JavaLambdaTypeGenerator extends JavaTypeGenerator {

    get returnTypeGenerator() {
        return this.schema.returnType.generator.java
    }

    get parameters() {
        return this.schema.parameters
    }

    getTypeStatement() {
        const parametersStatements = this.parameters.map(parameter =>
            parameter.generator.java.typeGenerator.getTypeStatement()).join(', ')
        const returnTypeStatement = this.returnTypeGenerator.getTypeStatement()

        const generics = this.parameters.length > 0
            ? `${parametersStatements}, ${returnTypeStatement}`
            : returnTypeStatement

        return `Lambda.F${this.parameters.length}<${generics}>`
    }

    getTypeClass() {
        return `Lambda.F${this.parameters.length}.class`
    }

    getNativeIniRet(jsFuncIniRet, context) {
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        const paramNames = this.parameters.map((parameter, index) => `${jsFuncVar}_v${index}`)

        return IniRet.create()
            .editIni(ini =>
                ini.append(jsFuncIniRet.initializationCode)
                    .append(`JSReference ${jsFuncVar} = `).append(jsFuncIniRet.returningCode).append(';').newLine())
            .editRet(ret =>
                ret.append(`${context.bjsEntrance}.getFunc(`).append(jsFuncVar)
                    .__.append(`, (${paramNames.join(', ')}) -> {`).newLineIndenting()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithNativeIniRet(jsFuncVar,
                        paramNames, context)))
                    .__.newLineDeindenting()
                    .append('})'))
    }

    getCallerWithNativeIniRet(jsFuncVar, paramNames, context) {
        const callJsIniRet = IniRet.create()
            .appendRet(`${context.bjsEntrance}.funcCall(${jsFuncVar}`)

        for (let paramIndex = 0; paramIndex < this.parameters.length; paramIndex++) {

            const argumentTypeGenerator = this.parameters[paramIndex].type.generator.java
            const argumentNativeIniRet = IniRet.create().appendRet(paramNames[paramIndex])

            callJsIniRet.appendRet(', ').append(argumentTypeGenerator.getJsIniRet(argumentNativeIniRet, context))
        }
        callJsIniRet.appendRet(')')

        return this.returnTypeGenerator.getNativeIniRet(callJsIniRet, context, false)
    }

    getJsIniRet(nativeFuncIniRet, context) {
        const nativeFuncVar = context.getUniqueIdentifier('nativeFunc')
        const jsFuncVar = context.getUniqueIdentifier('jsFunc')
        const jsReferencesVar = context.getUniqueIdentifier('jsReferences')
        return IniRet.create()
            .editIni(ini =>
                ini.append(nativeFuncIniRet.initializationCode)
                    .append(`${this.getTypeStatement()} ${nativeFuncVar} = `).append(nativeFuncIniRet.returningCode)
                    .__.append(';').newLine()
                    .append(`FunctionCallback<?> ${jsFuncVar} = ${jsReferencesVar} -> {`).newLineIndenting()
                    .append(`${jsReferencesVar} = bjs.ensureArraySize(${jsReferencesVar}, ${this.parameters.length});`).newLine()
                    .append(this.returnTypeGenerator.getNativeReturnCode(this.getCallerWithJsIniRet(nativeFuncVar,
                        jsReferencesVar, context))).newLineDeindenting()
                    .append('};').newLine())

            .editRet(ret =>
                ret.append(`${context.bjsEntrance}.putFunc(`).append(nativeFuncVar).append(`, ${jsFuncVar})`))
    }


    getCallerWithJsIniRet(nativeFuncVar, paramsVar, context) {
        const parameterCount = this.parameters.length
        const parametersIniRet = IniRet.create()
        for (let paramIndex = 0; paramIndex < parameterCount; paramIndex++) {

            const argumentTypeGenerator = this.parameters[paramIndex].type.generator.java
            const argumentJsIniRet = IniRet.create().appendRet(`${paramsVar}[${paramIndex}]`)
            parametersIniRet.append(argumentTypeGenerator.getNativeIniRet(argumentJsIniRet, context, false))

            if (paramIndex < parameterCount - 1) {
                parametersIniRet.appendRet(', ')
            }
        }

        const callIniRet = IniRet.create()
            .editIni(ini => ini.append())
            .editRet(ret => ret.append(`${nativeFuncVar}.apply(`)).append(parametersIniRet)
            .editRet(ret => ret.append(')'))

        return this.returnTypeGenerator.getJsIniRet(callIniRet, context)
    }
}

module.exports = {JavaLambdaTypeGenerator}