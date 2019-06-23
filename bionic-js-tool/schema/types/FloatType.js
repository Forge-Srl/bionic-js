const {Type} = require('./Type')

class FloatType extends Type {

    static get typeName() {
        return 'Float'
    }

    static fromObj(obj) {
        return new FloatType()
    }
}

module.exports = {FloatType}