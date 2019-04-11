const ObjectType = require('./ObjectType')

class WrappedObjectType extends ObjectType {

    static get typeName() {
        return 'WrappedObject'
    }

    static fromObj(obj) {
        return new WrappedObjectType(obj.className)
    }
}

module.exports = WrappedObjectType