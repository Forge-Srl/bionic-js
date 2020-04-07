const {Class} = require('../Class')
const nativeObjectClassName = 'BjsNativeObject'

class NativeObjectClass extends Class {

    constructor() {
        super(nativeObjectClassName, '', [], [], [], null, nativeObjectClassName)
    }

    get isNativeObjectClass() {
        return true
    }
}

module.exports = {NativeObjectClass, nativeObjectClassName}