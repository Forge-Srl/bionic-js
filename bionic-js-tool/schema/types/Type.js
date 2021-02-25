const {TypeGeneratorFactory} = require('../../generation/factory/TypeGeneratorFactory')
const getTypeClasses = require('./getTypeClasses')

class Type {

    static fromObj(obj) {
        return getTypeClasses()[obj.type].fromObj(obj)
    }

    constructor() {
        Object.assign(this, {typeName: this.constructor.typeName})
    }

    get isValid() {
        return {validity: true, error: null}
    }

    get generator() {
        return new TypeGeneratorFactory(this)
    }

    get dependingTypes() {
        return []
    }

    toString() {
        return this.constructor.typeName
    }

    resolveClassType(_nativeClassesMap) {
        return this
    }

    isEqualTo(otherType) {
        return JSON.stringify(this) === JSON.stringify(otherType)
    }
}

module.exports = {Type}