const {Type} = require('./Type')

class AnyType extends Type {

    static get typeName() {
        return 'Any'
    }

    static fromObj(obj) {
        return new AnyType()
    }
}

module.exports = {AnyType}