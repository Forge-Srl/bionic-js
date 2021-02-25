const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {SwiftGenerationContext} = require('./SwiftGenerationContext')
const {IniRet} = require('../code/IniRet')

class SwiftWrapperPropertyGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get hasGetter() {
        return this.schema.kinds.includes('get')
    }

    get hasSetter() {
        return this.schema.kinds.includes('set')
    }

    get typeGenerator() {
        return this.schema.type.generator.swift
    }

    get getterWrapperMethodName() {
        return this.getWrapperMethodName('Get')
    }

    get setterWrapperMethodName() {
        return this.getWrapperMethodName('Set')
    }

    get wrapperExportLines() {
        const exportLines = CodeBlock.create()

        if (this.hasGetter) {
            exportLines.append(`.exportFunction("${this.getterWrapperMethodName}", ${this.getterWrapperMethodName}())`)
        }
        if (this.hasGetter && this.hasSetter) {
            exportLines.newLine()
        }
        if (this.hasSetter) {
            exportLines.append(`.exportFunction("${this.setterWrapperMethodName}", ${this.setterWrapperMethodName}())`)
        }
        return exportLines
    }

    get nativePropertyIniRet() {
        return IniRet.create()
            .appendRet(this.schema.isStatic ?
                `${this.classSchema.name}.${this.schema.name}` :
                `bjs.getWrapped($0, ${this.classSchema.name}.self)!.${this.schema.name}`)
    }

    getWrapperMethodName(propertyModifier) {
        const staticMod = this.schema.isStatic ? 'Static' : ''
        return `bjs${staticMod}${propertyModifier}_${this.schema.name}`
    }

    getGetterCode() {
        if (!this.hasGetter) {
            return null
        }
        const typeGen = this.typeGenerator
        const getterContext = new SwiftGenerationContext()

        return CodeBlock.create()
            .append(`private class func ${this.getterWrapperMethodName}() -> @convention(block) (`)
            .__.append(`${this.schema.isStatic ? '' : 'JSValue'}) -> JSValue {`).newLineIndenting()
            .append('return {').newLineIndenting()
            .append(typeGen.getNativeReturnCode(typeGen.getJsIniRet(this.nativePropertyIniRet, getterContext), false))
            .__.newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }

    getSetterCode() {
        if (!this.hasSetter) {
            return null
        }
        const getterContext = new SwiftGenerationContext()
        const nativeValueIniRet = this.typeGenerator.getNativeIniRet(IniRet.create()
            .appendRet(this.schema.isStatic ? '$0' : '$1'), getterContext)

        return CodeBlock.create()
            .append(`private class func ${this.setterWrapperMethodName}() -> @convention(block) (`)
            .__.append(`${this.schema.isStatic ? '' : 'JSValue, '}JSValue) -> Void {`).newLineIndenting()
            .append('return {').newLineIndenting()
            .append(nativeValueIniRet.initializationCode)
            .append(this.nativePropertyIniRet.returningCode).append(' = ')
            .__.append(nativeValueIniRet.returningCode).newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}')
    }

    getCode() {
        const propertyCode = CodeBlock.create()
            .append(this.getGetterCode())

        if (this.hasGetter && this.hasSetter) {
            propertyCode.newLine().newLine()
        }
        return propertyCode.append(this.getSetterCode())
    }
}

module.exports = {SwiftWrapperPropertyGenerator}