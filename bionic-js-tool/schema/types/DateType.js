const {Type} = require('./Type')

class DateType extends Type {

    static get typeName() {
        return 'Date'
    }

    static fromObj(obj) {
        return new DateType()
    }
}

module.exports = {DateType}