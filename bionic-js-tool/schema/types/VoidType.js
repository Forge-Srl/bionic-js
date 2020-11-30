const {Type} = require('./Type')

class VoidType extends Type {

    static get typeName() {
        return 'Void'
    }

    static fromObj(obj) {
        return new VoidType()
    }
}

module.exports = {VoidType}