const {CodeGenerator} = require('../CodeGenerator')
const {IniRet} = require('../code/IniRet')

class SwiftParameterGenerator extends CodeGenerator {

    get typeGenerator() {
        return this.schema.type.generator.swift
    }

    getParameterStatement() {
        const typeStatement = this.typeGenerator.getTypeStatement()
        const typeName = this.schema.name

        return typeName ? `_ ${typeName}: ${typeStatement}` : typeStatement
    }

    getJsIniRet(context) {
        const nativeIniRet = IniRet.create().appendRet(this.schema.name)
        return this.typeGenerator.getJsIniRet(nativeIniRet, context)
    }

    getNativeIniRet(context) {
        const jsIniRet = IniRet.create().appendRet(this.schema.name)
        return this.typeGenerator.getNativeIniRet(jsIniRet, context)
    }
}

module.exports = {SwiftParameterGenerator}