const {ClassType} = require('./ClassType')

class JsClassType extends ClassType {

    static get typeName() {
        return 'JsClass'
    }

    static fromObj(obj) {
        return new JsClassType(obj.className)
    }

    resolveClassType(nativeClassesMap) {
        return this
    }
}

module.exports = {JsClassType}