const {Type} = require('./Type')

class IntType extends Type {

    static get typeName() {
        return 'Int'
    }

    static fromObj(_obj) {
        return new IntType()
    }
}

module.exports = {IntType}