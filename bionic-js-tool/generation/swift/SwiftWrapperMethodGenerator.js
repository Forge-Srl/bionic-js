const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {GenerationContext} = require('../code/GenerationContext')
const {IniRet} = require('../code/IniRet')
const {NativeClassType} = require('../../schema/types/NativeClassType')
const {Parameter} = require('../../schema/Parameter')

class SwiftWrapperMethodGenerator extends SwiftMethodGenerator {

    get wrapperExportLines() {
        return CodeBlock.create()
            .append(`.exportFunction("${this.wrapperMethodName}", ${this.wrapperMethodName}())`)
    }

    get wrapperMethodName() {
        if (!this._wrapperMethodName) {
            const staticMod = this.schema.isStatic ? 'Static' : ''
            this._wrapperMethodName = `bjs${staticMod}_${this.schema.name}`
        }
        return this._wrapperMethodName
    }

    get parametersIndexShift() {
        return this.schema.isStatic ? 0 : 1
    }

    get parameters() {
        const firstParameter = this.schema.isStatic ? [] : [new Parameter(new NativeClassType(), 'wrappedObj')]

        const otherParameters = super.parameters.map((parameter, index) =>
            new Parameter(parameter.type, `$${index + this.parametersIndexShift}`, parameter.description))

        return [...firstParameter, ...otherParameters]
    }

    getNativeMethodCall(argumentListCode) {
        return CodeBlock.create()
            .append(this.schema.isStatic ?
                `${this.classSchema.name}.${this.schema.name}(` :
                `Bjs.get.getWrapped($0, ${this.classSchema.name}.self)!.${this.schema.name}(`)
            .append(argumentListCode).append(')')
    }

    getCode() {
        const methodContext = new GenerationContext()
        const argumentsListNativeIniRet = this.getArgumentsListNativeIniRet(methodContext, this.parametersIndexShift)

        const callIniRet = IniRet.create()
            .appendIni(argumentsListNativeIniRet.initializationCode)
            .appendRet(this.getNativeMethodCall(argumentsListNativeIniRet.returningCode))

        const lambdaReturnTypeGen = this.returnTypeGenerator
        const lambdaCode = lambdaReturnTypeGen
            .getNativeReturnCode(lambdaReturnTypeGen.getJsIniRet(callIniRet, methodContext), false)

        return CodeBlock.create()
            .append(`private class func ${this.wrapperMethodName}() -> @convention(block) (`)
            .__.append(this.parameters.map(param => param.type.generator.swift.getBlockTypeStatement()).join(', '))
            .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement()).append(' {').newLineIndenting()
            .append('return {').newLineIndenting()
            .append(lambdaCode).newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftWrapperMethodGenerator}