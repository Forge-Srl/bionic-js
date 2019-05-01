const native = require('ToyComponent1')

class ToyComponent1 {
    
    // @bionic Float
    static get pi() {
        return native.bjsStaticGet_pi()
    }
    
    // @bionic (Int, Int) => Int
    static sum(number1, number2) {
        return native.bjsStatic_sum(number1, number2)
    }
    
    // @bionic (String, String)
    constructor(number1, number2) {
        native.bjsBind(this, number1, number2)
    }
    
    // @bionic Int
    get number1() {
        return native.bjsGet_number1(this)
    }
    
    // @bionic Int
    set number1(newValue) {
        native.bjsSet_number1(this, newValue)
    }
    
    // @bionic Int
    get number2() {
        return native.bjsGet_number2(this)
    }
    
    // @bionic Int
    set number2(newValue) {
        native.bjsSet_number2(this, newValue)
    }
    
    // @bionic (Int) => Int
    getSum(offset) {
        return native.bjs_getSum(this, offset)
    }
    
    // @bionic (ToyComponent1) => Int
    getToySum(toyComponent1) {
        return native.bjs_getToySum(this, toyComponent1)
    }
}

module.exports = ToyComponent1
