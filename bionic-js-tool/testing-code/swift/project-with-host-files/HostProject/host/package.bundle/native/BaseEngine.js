const {BjsNativeObject} = require('../BjsNativeObject')
const {bjsNative} = bjsNativeRequire('BaseEngine')

class BaseEngine extends BjsNativeObject {
    
    static get bjsNative() {
        return bjsNative
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

module.exports = {BaseEngine}