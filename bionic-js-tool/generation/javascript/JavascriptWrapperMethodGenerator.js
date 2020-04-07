const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {VoidType} = require('../../schema/types/VoidType')

class JavascriptWrapperMethodGenerator extends CodeGenerator {

    get wrapperMethodName() {
        if (!this._wrapperMethodName) {
            const staticMod = this.schema.isStatic ? 'Static' : ''
            this._wrapperMethodName = `bjs${staticMod}_${this.schema.name}`
        }
        return this._wrapperMethodName
    }

    getParametersList(includeThisReference) {
        const thisReference = includeThisReference ? ['this'] : []
        return [...thisReference, ...this.schema.parameters.map(parameter => parameter.name)].join(', ')
    }

    getCode() {
        const staticModifier = this.schema.isStatic ? 'static ' : ''
        const signatureParams = this.getParametersList(false)
        const returnStatement = this.schema.returnType instanceof VoidType ? '' : 'return '
        const nativeCallParams = this.getParametersList(!this.schema.isStatic)

        return CodeBlock.create()
            .append(`${staticModifier}${this.schema.name}(${signatureParams}) {`).newLineIndenting()
            .append(`${returnStatement}bjsNative.${this.wrapperMethodName}(${nativeCallParams})`).newLineDeindenting()
            .append('}')
    }
}

module.exports = {JavascriptWrapperMethodGenerator}