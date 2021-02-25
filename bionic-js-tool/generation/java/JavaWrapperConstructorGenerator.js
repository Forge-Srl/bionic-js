const {JavaMethodGenerator} = require('./JavaMethodGenerator')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {CodeBlock} = require('../code/CodeBlock')
const {VoidType} = require('../../schema/types/VoidType')
const {NativeClassType} = require('../../schema/types/NativeClassType')
const {JsRefType} = require('../../schema/types/JsRefType')
const {Parameter} = require('../../schema/Parameter')

class JavaWrapperConstructorGenerator extends JavaMethodGenerator {

    constructor(schema, classSchema, isConstructorPublic) {
        super(schema, classSchema)
        Object.assign(this, {isConstructorPublic})
    }

    get wrapperExportLines() {
        return null
    }

    get returnTypeGenerator() {
        return new VoidType().generator.java
    }

    get parameters() {
        const parameters = super.parameters.map((parameter, index) =>
            new Parameter(parameter.type, `jsReferences[${index + 1}]`, parameter.description))
        const firstParameter = new Parameter(new NativeClassType(), 'wrappedObj')
        const otherParameters = super.parameters.length
            ? parameters
            : [new Parameter(new JsRefType(), 'nativeObjPlaceholder')]
        return [firstParameter, ...otherParameters]
    }

    getInterfaceDeclaration() {
        return null
    }

    getCode() {
        const constructorContext = new JavaGenerationContext()
        const parametersToSkip = super.parameters.length ? 1 : 2
        const argumentsListNativeIniRet = this.getArgumentsListNativeIniRet(constructorContext, parametersToSkip)

        const publicConstructorCall = CodeBlock.create()
        if (this.isConstructorPublic) {
            publicConstructorCall
                .append('if (bound == null) {').newLineIndenting()
                .append(argumentsListNativeIniRet.initializationCode)
                .append(`bound = invokeConstructor(new Class[]{${this.getParametersClassesList(parametersToSkip)}}, new Object[]{`)
                .__.append(argumentsListNativeIniRet.returningCode).append('});').newLineDeindenting()
                .append('}').newLine()
        }

        return CodeBlock.create()
            .append('@BjsNativeWrapperTypeInfo.Binder').newLine()
            .append('public static void bjsBind_(BjsNativeExports nativeExports) {').newLineIndenting()
            .append('nativeExports.exportBindFunction(getInstance().bjsBind());').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append('protected FunctionCallback<?> bjsBind() {').newLineIndenting()
            .append('return jsReferences -> {').newLineIndenting()
            .append(`${this.classSchema.name}BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);`).newLine()
            .append(publicConstructorCall)
            .append('bjs.bindNative(bound, jsReferences[0]);').newLine()
            .append('return bjs.jsUndefined();').newLineDeindenting()
            .append('};').newLineDeindenting()
            .append('}')
    }
}

module.exports = {JavaWrapperConstructorGenerator}