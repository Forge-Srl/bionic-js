const SwiftMethodGenerator = require('./SwiftMethodGenerator')
const GenerationContext = require('../code/GenerationContext')
const CodeBlock = require('../code/CodeBlock')

class SwiftConstructorGenerator extends SwiftMethodGenerator {

    getImplementation() {
        const constructorContext = new GenerationContext()
        const argumentsListIniRet = this.getArgumentsListIniRet(constructorContext)

        return CodeBlock.create()
            .append(`convenience init(${this.getParametersStatements()}) {`).newLineIndenting()
            .append(argumentsListIniRet.initializationCode)
            .append(`self.init(${this.classSchema.name}.bjsClass, [`).append(argumentsListIniRet.returningCode)
            .__.append('])').newLineDeindenting()
            .append('}')
    }
}

module.exports = SwiftConstructorGenerator