const {ClassType} = require('./ClassType')

class NativeRefType extends ClassType {

    static get typeName() {
        return 'NativeRef'
    }

    static fromObj(obj) {
        return new NativeRefType(obj.className)
    }

    resolveClassType(nativeClassesMap) {
        return this
    }
}

module.exports = {NativeRefType}