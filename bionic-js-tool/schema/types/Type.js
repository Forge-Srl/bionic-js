const {JsonSerializable} = require('../../JsonSerializable')
const {TypeGeneratorFactory} = require('../../generation/factory/TypeGeneratorFactory')
const getTypeClasses = require('./getTypeClasses')

class Type extends JsonSerializable {

    constructor() {
        super()
        Object.assign(this, {typeName: this.constructor.typeName})
    }

    get isValid() {
        return {validity: true, error: null}
    }

    get generator() {
        return new TypeGeneratorFactory(this)
    }

    toString() {
        return this.constructor.typeName
    }

    static fromObj(obj) {
        return getTypeClasses()[obj.type].fromObj(obj)
    }
}

module.exports = {Type}