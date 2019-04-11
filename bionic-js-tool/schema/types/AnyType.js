const Type = require('./Type')

class AnyType extends Type {

    constructor() {
        super(AnyType.typeName)
    }

    static get typeName() {
        return 'Any'
    }

    static fromObj(obj) {
        return new AnyType()
    }
}

module.exports = AnyType