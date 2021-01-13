const {JavaMethodGenerator} = require('./JavaMethodGenerator')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {CodeBlock} = require('../code/CodeBlock')

class JavaHostConstructorGenerator extends JavaMethodGenerator {

    getCode() {
        const constructorContext = new JavaGenerationContext()
        const argumentsListIniRet = this.getArgumentsListJsIniRet(constructorContext)

        return CodeBlock.create()
            .append(`public ${this.classSchema.name}(JSReference[] arguments) {`).newLineIndenting()
            .append(`this(${this.classSchema.name}.class, arguments);`).newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append(`public ${this.classSchema.name}(${this.getParametersStatements()}) {`).newLineIndenting()
            .append(`this(bjs_${this.classSchema.name}(`).append(this.getParametersNamesList()).append(`));`).newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append(`private static JSReference[] bjs_${this.classSchema.name}(${this.getParametersStatements()}) {`).newLineIndenting()
            .append(argumentsListIniRet.initializationCode)
            .append(`return new JSReference[]{`).append(argumentsListIniRet.returningCode)
            .__.append(`};`)
            .newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        return CodeBlock.create()
            .append(`public ${this.classSchema.name}(${this.getParametersStatements()}) {`).newLineIndenting()
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {JavaHostConstructorGenerator}