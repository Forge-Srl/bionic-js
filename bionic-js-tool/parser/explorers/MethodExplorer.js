const JsExplorer = require('./JsExplorer')
const ParameterExplorer = require('./ParameterExplorer')
const Type = require('../../schema/types/Type')
const LambdaType = require('../../schema/types/LambdaType')
const Method = require('../../schema/Method')
const Property = require('../../schema/Property')

class MethodExplorer extends JsExplorer {

    get name() {
        return this.node.key.name
    }

    get kind() {
        return this.node.kind
    }

    get static() {
        return this.node.static
    }

    get generator() {
        return this.node.generator
    }

    get async() {
        return this.node.async
    }

    get parametersNodes() {
        return this.node.params
    }

    get parameters() {
        return this.parametersNodes.map(node => new ParameterExplorer(node))
    }

    get bionicTag() {
        return this.annotationTags.get('BionicTag')
    }

    get description() {
        return this.annotationTags.get('DescriptionTag') || ''
    }

    get type() {
        if (!this._type) {
            this._type = Type.fromObj(this.bionicTag.typeInfo)
        }
        return this._type
    }

    get signature() {
        if (!(this.type instanceof LambdaType)) {
            throw new Error('Method annotations should contain a lambda type definition like: () => Void')
        }
        return this.type
    }

    get schema() {
        if (!this.bionicTag) {
            return null
        }

        if (!this._schema) {
            if (this.kind === 'method') {
                this._schema = new Method(this.name, this.description, this.static, undefined,
                    this.signature.returnType, this.signature.parameters)

            } else if (this.kind === 'get' || this.kind === 'set') {
                this._schema = new Property(this.name, this.description, this.static, undefined, this.type, [this.kind])
            }
        }
        return this._schema
    }
}

module.exports = MethodExplorer