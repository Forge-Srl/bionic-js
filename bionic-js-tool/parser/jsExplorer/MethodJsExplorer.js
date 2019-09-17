const {JsExplorer} = require('./JsExplorer')
const {ParameterExplorer} = require('./ParameterExplorer')
const {Type} = require('../../schema/types/Type')
const {LambdaType} = require('../../schema/types/LambdaType')
const {Method} = require('../../schema/Method')
const {Property} = require('../../schema/Property')

class MethodJsExplorer extends JsExplorer {

    get isToExport() {
        return !!this.bionicTag
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
            this._type = Type.fromObj(this.bionicTag.typeInfo)

            if (this._type instanceof LambdaType) {
                const lambdaParameters = this._type.parameters
                const parametersNamesFromJs = this.parameterExplorers.map(explorer => explorer.name)

                if (lambdaParameters.length !== parametersNamesFromJs.length ||
                    lambdaParameters.some((parameter, index) => parameter.name && parametersNamesFromJs[index] !== parameter.name)) {

                    throw new Error(`parameter of method "${this.name}" mismatch from those declared in the annotation`)
                }

                this._type.parameters = lambdaParameters.map((parameter, index) => Object.assign(parameter, {name: parametersNamesFromJs[index]}))
            }
        }
        return this._type
    }

    // TODO: remove
    get signature() {
        if (!(this.type instanceof LambdaType)) {
            throw new Error(`method named "${this.name}" has an annotations without a lambda type definition`)
        }
        return this.type
    }

    // TODO: remove
    get schema() {
        if (!this.bionicTag) {
            return null
        }

        if (!this._schema) {
            if (this.kinds[0] === 'method') {
                this._schema = new Method(this.name, this.description, this.isStatic, undefined,
                    this.signature.returnType, this.signature.parameters)

            } else if (this.kinds[0] === 'get' || this.kinds[0] === 'set') {
                this._schema = new Property(this.name, this.description, this.isStatic, undefined, this.type, this.kinds)
            }
        }
        return this._schema
    }
}

module.exports = {MethodJsExplorer}