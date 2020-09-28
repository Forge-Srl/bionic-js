const {Type} = require('./Type')
const {VoidType} = require('./VoidType')

class ArrayType extends Type {

    static get typeName() {
        return 'Array'
    }

    static fromObj(obj) {
        return new ArrayType(Type.fromObj(obj.elementType))
    }

    constructor(elementType) {
        super()
        Object.assign(this, {elementType})
    }

    get isValid() {
        if (!(this.elementType instanceof Type))
            return {
                validity: false,
                error: 'element type is not a subclass of Type',
            }
        if (this.elementType instanceof VoidType)
            return {
                validity: false,
                error: 'VoidType is not valid as element type',
            }
        const elementTypeValidity = this.elementType.isValid
        if (!elementTypeValidity.validity)
            return elementTypeValidity

        return {validity: true, error: null}
    }

    toString() {
        return `${ArrayType.typeName}<${this.elementType.toString()}>`
    }

    resolveClassType(nativeClassesMap) {
        return new ArrayType(this.elementType.resolveClassType(nativeClassesMap))
    }
}

module.exports = {ArrayType}