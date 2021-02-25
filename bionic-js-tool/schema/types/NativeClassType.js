const {ClassType} = require('./ClassType')

class NativeClassType extends ClassType {

    static get typeName() {
        return 'NativeClass'
    }

    static fromObj(obj) {
        return new NativeClassType(obj.className)
    }

    resolveClassType(_nativeClassesMap) {
        return this
    }
}

module.exports = {NativeClassType}