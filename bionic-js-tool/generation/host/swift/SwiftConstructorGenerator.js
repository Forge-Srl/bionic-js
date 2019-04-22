const HostGeneratorWithClass = require('../HostGeneratorWithClass')
const CodeBlock = require('../../code/CodeBlock')
const GenerationContext = require('../../code/GenerationContext')

class SwiftConstructorGenerator extends HostGeneratorWithClass {

    getImplementation() {
        const parameterGenerators = this.schema.parameters.map(par => par.getSwiftGenerator())
        const parameterList = parameterGenerators.map(generator => generator.getParameterStatement()).join(', ')

        const constructorContext = new GenerationContext()
        const argumentsJsIniRets = parameterGenerators.map(paramGen => paramGen.getJsIniRet(constructorContext))

        const argumentsInitCode = CodeBlock.create()
        const argumentsRetCode = CodeBlock.create()
        for (let argId = 0; argId < argumentsJsIniRets.length; argId++) {
            const argIniRet = argumentsJsIniRets[argId]
            argumentsInitCode.append(argIniRet.initializationCode)
            argumentsRetCode.append(argIniRet.returningCode)
            if (argId < argumentsJsIniRets.length - 1) {
                argumentsRetCode.append(', ')
            }
        }

        return CodeBlock.create()
            .append(`convenience init(${parameterList}) {`).newLineIndenting()
            .append(argumentsInitCode)
            .append(`self.init(${this.classSchema.name}.bjsClass, [`).append(argumentsRetCode).append('])').newLineDeindenting()
            .append('}')
    }
}

module.exports = SwiftConstructorGenerator