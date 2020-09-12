class BjsNativeObject {

    constructor(...params) {
        this.constructor.bjsNative.bjsBind(this, ...params)
    }
}

module.exports = {BjsNativeObject}
