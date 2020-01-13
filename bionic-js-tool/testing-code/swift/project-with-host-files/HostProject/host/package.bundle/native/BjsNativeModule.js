class BjsNativeModule {

    constructor(...params) {
        this.constructor.bjsNative.bjsBind(this, ...params)
    }
}

module.exports = {BjsNativeModule}