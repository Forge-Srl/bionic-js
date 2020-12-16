const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {SwiftGenerationContext} = require('./SwiftGenerationContext')
const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostConstructorGenerator extends SwiftMethodGenerator {

    getCode() {
        const constructorContext = new SwiftGenerationContext(this.classSchema.name)
        const argumentsListIniRet = this.getArgumentsListJsIniRet(constructorContext)

        return CodeBlock.create()
            .append(`convenience init(${this.getParametersStatements()}) {`).newLineIndenting()
            .append(argumentsListIniRet.initializationCode)
            .append(`self.init(${this.classSchema.name}.bjsClass, [`).append(argumentsListIniRet.returningCode)
            .__.append('])').newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        return CodeBlock.create()
            .append(`init(${this.getParametersStatements()}) {`).newLineIndenting()
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostConstructorGenerator}