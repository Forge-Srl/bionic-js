const {Type} = require('./Type')

class BoolType extends Type {

    static get typeName() {
        return 'Bool'
    }

    static fromObj(_obj) {
        return new BoolType()
    }
}

module.exports = {BoolType}