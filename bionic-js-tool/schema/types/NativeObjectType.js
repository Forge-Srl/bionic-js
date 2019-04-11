const ObjectType = require('./ObjectType')

class NativeObjectType extends ObjectType {

    static get typeName() {
        return 'NativeObject'
    }

    static fromObj(obj) {
        return new NativeObjectType(obj.className)
    }
}

module.exports = NativeObjectType