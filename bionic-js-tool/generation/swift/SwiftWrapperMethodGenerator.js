const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {GenerationContext} = require('../code/GenerationContext')
const {IniRet} = require('../code/IniRet')

class SwiftWrapperMethodGenerator extends SwiftMethodGenerator {

    get returnTypeGenerator() {
        return this.schema.returnType.generator.swift
    }

    getWrapperExportLine() {
        const staticMod = this.schema.isStatic ? 'Static' : ''
        const methodName = `bjs${staticMod}_${this.schema.name}`

        return CodeBlock.create()
            .append(`.exportFunction("${methodName}", ${methodName}())`)
    }

    getHeaderCode() {
        const override_ = this.schema.isOverriding ? 'override ' : ''
        const class_ = this.schema.isStatic ? 'class ' : ''
        const returnTypeStatement = this.returnTypeGenerator.getNativeReturnTypeStatement()

        return CodeBlock.create()
            .append(`${override_}${class_}func ${this.schema.name}(`).append(this.getParametersStatements())
            .__.append(`)${returnTypeStatement} {`)
    }

    getBodyCode() {
        const methodContext = new GenerationContext()
        const anyParameter = this.schema.parameters.length
        const returnTypeGen = this.returnTypeGenerator

        const callIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'Bjs.get.call(self.bjsClass, ' : 'bjsCall(').appendRet(`"${this.schema.name}"`)
            .__.appendRet(anyParameter ? ', ' : '').append(this.getArgumentsListIniRet(methodContext)).appendRet(')')
        return returnTypeGen.getNativeReturnCode(returnTypeGen.getNativeIniRet(callIniRet, methodContext))

    }

    getHostCode() {
        return CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()
            .append(this.getBodyCode()).newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftWrapperMethodGenerator}