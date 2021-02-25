const {JsExplorer} = require('./JsExplorer')
const {ParameterExplorer} = require('./ParameterExplorer')
const {Type} = require('../../schema/types/Type')
const {LambdaType} = require('../../schema/types/LambdaType')
const {VoidType} = require('../../schema/types/VoidType')

class MethodJsExplorer extends JsExplorer {

    get isToExport() {
        return (!!this.bionicTag) && (!this.bionicTag.name || this.bionicTag.name === this.name)
    }

    get name() {
        return this.node.key.name
    }

    get kinds() {
        return [this.node.kind]
    }

    get isStatic() {
        return this.node.static
    }

    get isGenerator() {
        return this.node.generator
    }

    get isAsync() {
        return this.node.async
    }

    get parameterNodes() {
        return this.node.params
    }

    get parameterExplorers() {
        return this.parameterNodes.map(node => new ParameterExplorer(node))
    }

    get type() {
        if (!this._type) {

            const isMethodOrConstructor = this.kinds.includes('method') || this.kinds.includes('constructor')
            const typeInfo = this.bionicTag.typeInfo
            const parametersNamesFromJs = this.parameterExplorers.map(explorer => explorer.name)

            let type
            if (isMethodOrConstructor && !typeInfo && parametersNamesFromJs.length === 0) {
                type = new LambdaType(new VoidType(), [])
            } else {
                if (!typeInfo) {
                    throw new Error(`missing type info annotation in method "${this.name}"`)
                }
                type = Type.fromObj(typeInfo)
            }

            if (isMethodOrConstructor && type instanceof LambdaType) {
                const lambdaParameters = type.parameters

                if (lambdaParameters.length > parametersNamesFromJs.length ||
                    lambdaParameters.some((parameter, index) =>
                        parameter.name && parametersNamesFromJs[index] !== parameter.name)) {

                    throw new Error(`parameter of method "${this.name}" mismatch from those declared in the annotation`)
                }

                type.parameters = lambdaParameters.map((parameter, index) =>
                    Object.assign(parameter, {name: parametersNamesFromJs[index]}))
            }
            this._type = type
        }
        return this._type
    }
}

module.exports = {MethodJsExplorer}