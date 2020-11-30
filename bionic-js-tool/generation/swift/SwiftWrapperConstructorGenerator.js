const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {GenerationContext} = require('../code/GenerationContext')
const {CodeBlock} = require('../code/CodeBlock')
const {VoidType} = require('../../schema/types/VoidType')
const {NativeClassType} = require('../../schema/types/NativeClassType')
const {NativeRefType} = require('../../schema/types/NativeRefType')
const {Parameter} = require('../../schema/Parameter')

class SwiftWrapperConstructorGenerator extends SwiftMethodGenerator {

    constructor(schema, classSchema, isConstructorPublic) {
        super(schema, classSchema)
        Object.assign(this, {isConstructorPublic})
    }

    get wrapperExportLines() {
        return null
    }

    get returnTypeGenerator() {
        return new VoidType().generator.swift
    }

    get parameters() {
        const parameters = super.parameters.map((parameter, index) =>
            new Parameter(parameter.type, `$${index + 1}`, parameter.description))
        const firstParameter = new Parameter(new NativeClassType(), 'wrappedObj')
        const otherParameters = super.parameters.length ? parameters : [new Parameter(new NativeRefType(), 'nativeObj')]
        return [firstParameter, ...otherParameters]
    }

    getCode() {
        const constructorContext = new GenerationContext()
        const parametersToSkip = super.parameters.length ? 1 : 2
        const argumentsListNativeIniRet = this.getArgumentsListNativeIniRet(constructorContext, parametersToSkip)

        const publicConstructorCall = CodeBlock.create()
        if (this.isConstructorPublic) {
            publicConstructorCall
                .append(` ?? ${this.classSchema.name}(`).append(argumentsListNativeIniRet.returningCode).append(')')
        }

        return CodeBlock.create()
            .append('override class func bjsBind(_ nativeExports: BjsNativeExports) {').newLineIndenting()
            .append('_ = nativeExports.exportBindFunction({').newLineIndenting()
            .append(argumentsListNativeIniRet.initializationCode)
            .append(`bjs.bindNative(bjs.getBound($1, ${this.classSchema.name}.self)`)
            .__.append(publicConstructorCall)
            .__.append(', $0)').newLineDeindenting()
            .append('} as @convention(block) (')
            .__.append(this.parameters.map(param => param.type.generator.swift.getBlockTypeStatement()).join(', '))
            .__.append(')').append(this.returnTypeGenerator.getBlockReturnTypeStatement())
            .__.append(')').newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftWrapperConstructorGenerator}