const {BjsNativeModule} = require('./BjsNativeModule')
const {bjsNative} = require('Engine')

class Engine extends BjsNativeModule {

    static get bjsNative() {
        return bjsNative
    }

    get fuelType() {
        return bjsNative.bjsGet_fuelType(this)
    }

    powerOn() {
        return bjsNative.bjs_powerOn(this)
    }

    powerOff() {
        return bjsNative.bjs_powerOff(this)
    }

    watch(callback) {
        return bjsNative.bjs_watch(this, callback)
    }
}

module.exports = {Engine}
