const {Type} = require('./Type')

class StringType extends Type {

    static get typeName() {
        return 'String'
    }

    static fromObj(_obj) {
        return new StringType()
    }
}

module.exports = {StringType}