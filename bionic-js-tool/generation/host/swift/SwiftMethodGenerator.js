const HostGeneratorWithClass = require('../HostGeneratorWithClass')
const CodeBlock = require('../../code/CodeBlock')

class SwiftMethodGenerator extends HostGeneratorWithClass {

    getImplementation() {
        return CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()
            .getBodyCode().newLineDeindenting()
            .append('}')
    }

    getHeaderCode() {
        const override_ = this.schema.isOverriding ? 'override ' : ''
        const class_ = this.schema.isStatic ? 'class ' : ''
        const parameters = this.schema.parameters.map(par => par.getSwiftGenerator().getParameterStatement()).join(', ')
        const returnSignature = this.schema.returnType.getSwiftGenerator().getMethodReturnSignature()

        return CodeBlock.create()
            .append(`${override_}${class_}func ${this.schema.name}(${parameters})${returnSignature} {`)
    }

    getBodyCode() {
        const returnStatement = this.schema.returnType.getSwiftGenerator().getReturnStatement()

        return CodeBlock.create()
            .append(returnStatement).append(this.schema.isStatic ? 'Bjs.get.call' : 'bjsCall')
            .append(`("${this.schema.name}")`)

    }
}

module.exports = SwiftMethodGenerator