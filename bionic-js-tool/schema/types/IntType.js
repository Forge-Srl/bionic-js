const Type = require('./Type')

class IntType extends Type {

    constructor() {
        super(IntType.typeName)
    }

    static get typeName() {
        return 'Int'
    }

    static fromObj(obj) {
        return new IntType()
    }
}

module.exports = IntType