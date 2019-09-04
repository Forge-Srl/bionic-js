const {JsExplorer} = require('./JsExplorer')
const {ParameterExplorer} = require('./ParameterExplorer')
const {Type} = require('../../schema/types/Type')
const {LambdaType} = require('../../schema/types/LambdaType')
const {Method} = require('../../schema/Method')
const {Property} = require('../../schema/Property')

class MethodExplorer extends JsExplorer {

    get isToExport() {
        return !!this.bionicTag
    }

    get name() {
        return this.node.key.name
    }

    get kinds() {
        return [this.node.kind]
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

    get parameterNodes() {
        return this.node.params
    }

    get parameterExplorers() {
        return this.parameterNodes.map(node => new ParameterExplorer(node))
    }

    get type() {
        if (!this._type) {
            this._type = Type.fromObj(this.bionicTag.typeInfo)
        }
        return this._type
    }

    // TODO: remove
    get signature() {
        if (!(this.type instanceof LambdaType)) {
            throw new Error(`Method named "${this.name}" has an annotations without a lambda type definition`)
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
                this._schema = new Method(this.name, this.description, this.static, undefined,
                    this.signature.returnType, this.signature.parameters)

            } else if (this.kinds[0] === 'get' || this.kinds[0] === 'set') {
                this._schema = new Property(this.name, this.description, this.static, undefined, this.type, this.kinds)
            }
        }
        return this._schema
    }
}

module.exports = {MethodExplorer}