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

    get dependingTypes() {
        return [
            this.returnType,
            ...this.returnType.dependingTypes,
            ...this.parameters.flatMap(param => param.dependingTypes)
        ]
    }

    toString() {
        return `(${this.parameters.map(par => par.type.toString()).join(', ')}) => ${this.returnType.toString()}`
    }

    resolveClassType(nativeClassesMap) {
        return new LambdaType(this.returnType.resolveClassType(nativeClassesMap),
            this.parameters.map(par => par.resolveClassType(nativeClassesMap)))
    }
}

module.exports = {LambdaType}