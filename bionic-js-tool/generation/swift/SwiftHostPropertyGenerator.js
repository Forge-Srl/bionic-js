const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {GenerationContext} = require('../code/GenerationContext')
const {IniRet} = require('../code/IniRet')

class SwiftHostPropertyGenerator extends CodeGenerator {

    get typeGenerator() {
        try {
            return this.schema.type.generator.swift
        } catch (error) {
            console.log(error)
        }
    }

    getHeaderCode() {
        const override_ = this.schema.isOverriding ? 'override ' : ''
        const class_ = this.schema.isStatic ? 'class ' : ''
        const typeStatement = this.typeGenerator.getTypeStatement()

        return CodeBlock.create()
            .append(`${override_}${class_}var ${this.schema.name}:`).append(`${typeStatement} {`)
    }

    getGetterCode() {
        if (!this.schema.kinds.includes('get'))
            return null

        const jsValueIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'Bjs.get.getProperty(self.bjsClass, ' : 'bjsGetProperty(')
            .__.appendRet(`"${this.schema.name}")`)

        const typeGen = this.typeGenerator
        const getterContext = new GenerationContext()

        return CodeBlock.create()
            .append('get {').newLineIndenting()
            .append(typeGen.getNativeReturnCode(typeGen.getNativeIniRet(jsValueIniRet, getterContext))).newLineDeindenting()
            .append('}')
    }

    getSetterCode() {
        if (!this.schema.kinds.includes('set'))
            return null

        const setterContext = new GenerationContext()
        const jsValueIniRet = this.typeGenerator.getJsIniRet(IniRet.create().appendRet('newValue'), setterContext)

        return CodeBlock.create()
            .append('set {').newLineIndenting()
            .append(jsValueIniRet.initializationCode)
            .append(this.schema.isStatic ? 'Bjs.get.setProperty(self.bjsClass, ' : 'bjsSetProperty(')
            .__.append(`"${this.schema.name}", `).append(jsValueIniRet.returningCode).append(')').newLineDeindenting()
            .append('}')
    }

    getCode() {
        const getterCode = this.getGetterCode()
        const setterCode = this.getSetterCode()

        const propertyCode = CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()
            .append(getterCode)

        if (getterCode && setterCode)
            propertyCode.newLine()

        return propertyCode.append(setterCode)
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftHostPropertyGenerator}