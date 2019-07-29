const {SwiftMethodGenerator} = require('./SwiftMethodGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {GenerationContext} = require('../code/GenerationContext')
const {IniRet} = require('../code/IniRet')

class SwiftWrapperMethodGenerator extends SwiftMethodGenerator {

    /*

    class func bjsStatic_sum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(ToyComponent1.sum(Bjs.get.getInt($0), Bjs.get.getInt($1)))
        }
    }

     */

    get returnTypeGenerator() {
        return this.schema.returnType.generator.swift
    }

    get methodName() {
        if (!this._methodName) {
            const staticMod = this.schema.isStatic ? 'Static' : ''
            this._methodName = `bjs${staticMod}_${this.schema.name}`
        }
        return this._methodName
    }

    getWrapperExportLine() {
        return CodeBlock.create()
            .append(`.exportFunction("${this.methodName}", ${this.methodName}())`)
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
        const anyParameter = this.parameters.length
        const returnTypeGen = this.returnTypeGenerator

        const callIniRet = IniRet.create()
            .appendRet(this.schema.isStatic ? 'Bjs.get.call(self.bjsClass, ' : 'bjsCall(').appendRet(`"${this.schema.name}"`)
            .__.appendRet(anyParameter ? ', ' : '').append(this.getArgumentsListJsIniRet(methodContext)).appendRet(')')
        return returnTypeGen.getNativeReturnCode(returnTypeGen.getNativeIniRet(callIniRet, methodContext))

    }

    getCode() {
        return CodeBlock.create()
            .append(this.getHeaderCode()).newLineIndenting()
            .append(this.getBodyCode()).newLineDeindenting()
            .append('}')
    }
}

module.exports = {SwiftWrapperMethodGenerator}