const {Type} = require('./Type')

class JsRefType extends Type {

    static get typeName() {
        return 'JsRef'
    }

    static fromObj(_obj) {
        return new JsRefType()
    }

    resolveClassType(_nativeClassesMap) {
        return this
    }
}

module.exports = {JsRefType}