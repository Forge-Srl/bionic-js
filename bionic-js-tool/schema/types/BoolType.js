const Type = require('./Type')

class BoolType extends Type {

    static get typeName() {
        return 'Bool'
    }

    static fromObj(obj) {
        return new BoolType()
    }

    constructor() {
        super(BoolType.typeName)
    }
}

module.exports = BoolType