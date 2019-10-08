const {Type} = require('./Type')
const {Validation} = require('../Validation')

class ObjectType extends Type {

    static get typeName() {
        return 'Object'
    }

    static fromObj(obj) {
        return new ObjectType(obj.className)
    }

    constructor(className) {
        super()
        Object.assign(this, {className})
    }

    get isValid() {
        return Validation.validateIdentifier('class name', this.className)
    }

    toString() {
        return this.className
    }

    resolveNativeType(jsClasses, nativeClasses) {
        if (nativeClasses.has(this.className)) {
            return new (require('./WrappedObjectType').WrappedObjectType)(this.className)
        } else if (!jsClasses.has(this.className)) {
            return new (require('./NativeObjectType').NativeObjectType)(this.className)
        }
        return this
    }
}

module.exports = {ObjectType}