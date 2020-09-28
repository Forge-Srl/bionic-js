const {Type} = require('./Type')
const {Validation} = require('../Validation')

class ClassType extends Type {

    static get typeName() {
        return 'Class'
    }

    static fromObj(obj) {
        return new ClassType(obj.className)
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

    resolveClassType(nativeClassesMap) {
        const isNativeClass = nativeClassesMap.get(this.className)
        if (isNativeClass === undefined) {
            return new (require('./NativeRefType').NativeRefType)(this.className)
        } else if (isNativeClass) {
            return new (require('./NativeClassType').NativeClassType)(this.className)
        } else {
            return new (require('./JsClassType').JsClassType)(this.className)
        }
    }
}

module.exports = {ClassType}