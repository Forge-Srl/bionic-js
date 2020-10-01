const {BaseEngine} = require('./BaseEngine')
const {bjsNative} = bjsNativeRequire('Engine')

class Engine extends BaseEngine {
    
    static get bjsNative() {
        return bjsNative
    }
    
    get fuelType() {
        return bjsNative.bjsGet_fuelType(this)
    }
}

module.exports = {Engine}