const {Type} = require('./Type')

class JsRefType extends Type {

    static get typeName() {
        return 'JsRef'
    }

    static fromObj(obj) {
        return new JsRefType()
    }

    resolveClassType(nativeClassesMap) {
        return this
    }
}

module.exports = {JsRefType}