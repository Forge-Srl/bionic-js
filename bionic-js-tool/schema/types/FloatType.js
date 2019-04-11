const Type = require('./Type')

class FloatType extends Type {

    constructor() {
        super(FloatType.typeName)
    }

    static get typeName() {
        return 'Float'
    }

    static fromObj(obj) {
        return new FloatType()
    }
}

module.exports = FloatType