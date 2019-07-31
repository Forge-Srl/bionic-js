const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {GenerationContext} = require('../code/GenerationContext')
const {CodeBlock} = require('../code/CodeBlock')
const {VoidType} = require('../../schema/types/VoidType')
const {WrappedObjectType} = require('../../schema/types/WrappedObjectType')
const {NativeObjectType} = require('../../schema/types/NativeObjectType')
const {Parameter} = require('../../schema/Parameter')

class SwiftWrapperConstructorGenerator extends SwiftMethodGenerator {

    get wrapperExportLines() {
        return CodeBlock.create()
            .append('.exportBindFunction(bjsBind())')
    }

    get returnTypeGenerator() {
        return new VoidType().generator.swift
    }

    get parameters() {
        const parameters = super.parameters.map((parameter, index) =>
            new Parameter(parameter.type, `$${index + 1}`, parameter.description))
        const firstParameter = new Parameter(new WrappedObjectType(), 'wrappedObj')
        const otherParameters = super.parameters.length ? parameters : [new Parameter(new NativeObjectType(), 'nativeObj')]
        return [firstParameter, ...otherParameters]
    }

    getCode() {
        const constructorContext = new GenerationContext()
        const parametersToSkip = super.parameters.length ? 1 : 2
        const argumentsListNativeIniRet = this.getArgumentsListNativeIniRet(constructorContext, parametersToSkip)

        return CodeBlock.create()
            .append('class func bjsBind() -> @convention(block) (')
            .__.append(this.parameters.map(param => param.type.generator.swift.getBlockTypeStatement()).join(', '))
            .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement()).append(' {').newLineIndenting()
            .append('return {').newLineIndenting()
            .append(argumentsListNativeIniRet.initializationCode)
            .append(`Bjs.get.bindNative(Bjs.get.getBound($1, ${this.classSchema.name}.self) ?? ${this.classSchema.name}(`)
            .append(argumentsListNativeIniRet.returningCode).append('), $0)').newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftWrapperConstructorGenerator}