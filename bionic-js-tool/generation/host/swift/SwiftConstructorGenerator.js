const HostGeneratorWithClass = require('../HostGeneratorWithClass')
const CodeBlock = require('../../code/CodeBlock')
const BlockContext = require('../../code/GenerationContext')

class SwiftConstructorGenerator extends HostGeneratorWithClass {

    getImplementation() {
        const parameterGenerators = this.schema.parameters.map(par => par.getSwiftGenerator())
        const parameterList = parameterGenerators.map(generator => generator.getParameterStatement()).join(', ')

        const argumentsJsIniRets = parameterGenerators.map(generator => generator.getJsIniRet(new BlockContext()))

        const argumentsInitCode = CodeBlock.create()
        argumentsJsIniRets.map(iniRet => iniRet.initializationCode).forEach(initCode => argumentsInitCode.append(initCode))

        const argumentsReturningList = argumentsJsIniRets.map(iniRet => iniRet.returningCode.getString()).join(', ')

        return CodeBlock.create()
            .append(`convenience init(${parameterList}) {`).newLineIndenting()
            .append(argumentsInitCode)
            .append(`self.init(${this.classSchema.name}.bjsClass, [${argumentsReturningList}])`).newLineDeindenting()
            .append('}')
    }
}

module.exports = SwiftConstructorGenerator