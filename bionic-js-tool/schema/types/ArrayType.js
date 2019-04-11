const Type = require('./Type')
const VoidType = require('./VoidType')

class ArrayType extends Type {

    constructor(elementType) {
        super(ArrayType.typeName)
        Object.assign(this, {elementType})
    }

    get isValid() {
        if (!(this.elementType instanceof Type))
            return {
                validity: false,
                error: 'element type is not a subclass of Type'
            }
        if (this.elementType instanceof VoidType)
            return {
                validity: false,
                error: 'VoidType is not valid as element type'
            }
        const elementTypeValidity = this.elementType.isValid
        if (!elementTypeValidity.validity)
            return elementTypeValidity

        return {validity: true, error: null}
    }

    toString() {
        return `${ArrayType.typeName}<${this.elementType.toString()}>`
    }

    static get typeName() {
        return 'Array'
    }

    static fromObj(obj) {
        return new ArrayType(Type.fromObj(obj.elementType))
    }
}

module.exports = ArrayType