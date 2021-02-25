const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {SwiftGenerationContext} = require('./SwiftGenerationContext')
const {IniRet} = require('../code/IniRet')
const {SwiftKeywords} = require('./SwiftKeywords')

class SwiftHostPropertyGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get typeGenerator() {
        return this.schema.type.generator.swift
    }

    get hasGetter() {
        return this.schema.kinds.includes('get')
    }

    get hasSetter() {
        return this.schema.kinds.includes('set')
    }

    getHeaderCode() {
        const clazz = this.schema.isStatic ? 'class ' : ''
        const typeStatement = this.typeGenerator.getTypeStatement()

        return CodeBlock.create()
            .append(`${clazz}var ${SwiftKeywords.getSafeIdentifier(this.schema.name)}:`).append(`${typeStatement} {`)
    }

    getGetterCode() {
        if (!this.hasGetter) {
            return null
        }

        const jsValueIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'bjs.getProperty(self.bjsClass, ' : 'bjsGetProperty(')
            .__.appendRet(`"${this.schema.name}")`)

        const typeGen = this.typeGenerator
        const getterContext = new SwiftGenerationContext(this.schema.isStatic ? null : this.classSchema.name)

        return CodeBlock.create()
            .append('get {').newLineIndenting()
            .append(typeGen.getNativeReturnCode(typeGen.getNativeIniRet(jsValueIniRet, getterContext), true))
            .__.newLineDeindenting()
            .append('}')
    }

    getSetterCode() {
        if (!this.hasSetter) {
            return null
        }

        const setterContext = new SwiftGenerationContext(this.schema.isStatic ? null : this.classSchema.name)
        const jsValueIniRet = this.typeGenerator.getJsIniRet(IniRet.create().appendRet('newValue'), setterContext)

        return CodeBlock.create()
            .append('set {').newLineIndenting()
            .append(jsValueIniRet.initializationCode)
            .append(this.schema.isStatic ? 'bjs.setProperty(self.bjsClass, ' : 'bjsSetProperty(')
            .__.append(`"${this.schema.name}", `).append(jsValueIniRet.returningCode).append(')').newLineDeindenting()
            .append('}')
    }

    getCode() {
        const getterCode = this.getGetterCode()
        const setterCode = this.getSetterCode()

        const propertyCode = CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()
            .append(getterCode)

        if (getterCode && setterCode) {
            propertyCode.newLine()
        }

        return propertyCode.append(setterCode)
            .newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        const scaffoldCode = CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()

        if (this.hasGetter) {
            scaffoldCode
                .append('get {').newLineIndenting()
                .newLineDeindenting()
                .append('}')
        }

        if (this.hasGetter && this.hasSetter) {
            scaffoldCode.newLine()
        }

        if (this.hasSetter) {
            scaffoldCode
                .append('set {').newLineIndenting()
                .newLineDeindenting()
                .append('}')
        }
        return scaffoldCode.newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostPropertyGenerator}