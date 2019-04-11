const Type = require('./Type')
const Validation = require('../Validation')

class ObjectType extends Type {

    static get typeName() {
        return 'Object'
    }

    static fromObj(obj) {
        return new ObjectType(obj.className)
    }

    constructor(className) {
        super(ObjectType.typeName)
        Object.assign(this, {className})
    }

    get isValid() {
        return Validation.validateIdentifier('class name', this.className)
    }

    toString() {
        return this.className
    }
}

module.exports = ObjectType