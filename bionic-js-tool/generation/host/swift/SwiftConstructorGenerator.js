const HostGeneratorWithClass = require('../HostGeneratorWithClass')
const CodeBlock = require('../../code/CodeBlock')

class SwiftConstructorGenerator extends HostGeneratorWithClass {

    getImplementation() {
        const paramsGenerators = this.schema.parameters.map(par => par.getSwiftGenerator())

        const paramsList = paramsGenerators.map(generator => generator.getParameterStatement()).join(', ')

        const paramsJsIniRets = paramsGenerators.map(generator => generator.getJsIniRet())
        const paramsJsInits = CodeBlock.create()
        paramsJsIniRets.map(iniRet => iniRet.initializationCode).forEach(initCode => paramsJsInits.append(initCode))

        const paramsJsRets = paramsJsIniRets.map(iniRet => iniRet.returningCode.getString()).join(', ')

        return CodeBlock.create()
            .append(`convenience init(${paramsList}) {`).newLineIndenting()
            .append(paramsJsInits)
            .append(`self.init(${this.classSchema.name}.bjsClass, [${paramsJsRets}])`).newLineDeindenting()
            .append('}')
    }
}

module.exports = SwiftConstructorGenerator