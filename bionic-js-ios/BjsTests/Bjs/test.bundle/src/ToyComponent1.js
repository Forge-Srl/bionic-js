const {BjsNativeObject} = require('./BjsNativeObject')
const {bjsNative} = require('ToyComponent1')

class ToyComponent1 extends BjsNativeObject {
    
    static get bjsNative() {
        return bjsNative
    }
    
    // @bionic Float
    static get pi() {
        return bjsNative.bjsStaticGet_pi()
    }
    
    // @bionic (Int, Int) => Int
    static sum(number1, number2) {
        return bjsNative.bjsStatic_sum(number1, number2)
    }
        
    // @bionic Int
    get number1() {
        return bjsNative.bjsGet_number1(this)
    }
    
    // @bionic Int
    set number1(newValue) {
        bjsNative.bjsSet_number1(this, newValue)
    }
    
    // @bionic Int
    get number2() {
        return bjsNative.bjsGet_number2(this)
    }
    
    // @bionic Int
    set number2(newValue) {
        bjsNative.bjsSet_number2(this, newValue)
    }
    
    // @bionic (Int) => Int
    getSum(offset) {
        return bjsNative.bjs_getSum(this, offset)
    }
    
    // @bionic (ToyComponent1) => Int
    getToySum(toyComponent1) {
        return bjsNative.bjs_getToySum(this, toyComponent1)
    }
}

module.exports = {ToyComponent1}
