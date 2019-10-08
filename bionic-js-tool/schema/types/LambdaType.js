const {Type} = require('./Type')
const {Parameter} = require('../Parameter')

class LambdaType extends Type {

    static get typeName() {
        return 'Lambda'
    }

    static fromObj(obj) {
        return new LambdaType(Type.fromObj(obj.returnType), obj.parameters.map(par => Parameter.fromObj(par)))
    }

    constructor(returnType, parameters) {
        super()
        Object.assign(this, {returnType, parameters})
    }

    get isValid() {
        const isValid = this.returnType.isValid
        if (!isValid.validity) {
            return {
                validity: false,
                error: `invalid return type: ${isValid.error}`,
            }
        }
        for (const parameter of this.parameters) {
            const isValid = parameter.type.isValid
            if (!isValid.validity) {
                return {
                    validity: false,
                    error: `invalid type for parameter:"${parameter.name}": ${isValid.error}`,
                }
            }
        }
        return super.isValid
    }

    toString() {
        return `(${this.parameters.map(par => par.type.toString()).join(', ')}) => ${this.returnType.toString()}`
    }

    resolveNativeType(jsClasses, nativeClasses) {
        return new LambdaType(this.returnType.resolveNativeType(jsClasses, nativeClasses),
            this.parameters.map(par => new Parameter(par.type.resolveNativeType(jsClasses, nativeClasses), par.name, par.description)))
    }
}

module.exports = {LambdaType}