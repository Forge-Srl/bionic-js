const {Type} = require('./Type')

class VoidType extends Type {

    static get typeName() {
        return 'Void'
    }

    static fromObj(_obj) {
        return new VoidType()
    }
}

module.exports = {VoidType}