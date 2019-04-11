const Type = require('./Type')

class VoidType extends Type {

    constructor() {
        super(VoidType.typeName)
    }

    static get typeName() {
        return 'Void'
    }

    static fromObj(obj) {
        return new VoidType()
    }
}

module.exports = VoidType