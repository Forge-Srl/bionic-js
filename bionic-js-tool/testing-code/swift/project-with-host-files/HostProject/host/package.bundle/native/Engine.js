const {BjsNativeObject} = require('../BjsNativeObject')
const {bjsNative} = require('Engine')

class Engine extends BjsNativeObject {
    
    static get bjsNative() {
        return bjsNative
    }
    
    get fuelType() {
        return bjsNative.bjsGet_fuelType(this)
    }
    
    powerOn() {
        bjsNative.bjs_powerOn(this)
    }
    
    powerOff() {
        bjsNative.bjs_powerOff(this)
    }
    
    watch(callback) {
        bjsNative.bjs_watch(this, callback)
    }
}

module.exports = {Engine}