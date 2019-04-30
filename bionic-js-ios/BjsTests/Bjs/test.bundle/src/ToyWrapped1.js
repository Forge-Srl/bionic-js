const native = require('ToyWrapped1')

class ToyWrapped1 {
    
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
    
    // @bionic (ToyWrapped1) => Int
    getToySum(toy) {
        return native.bjs_getToySum(this, toy)
    }
}

module.exports = ToyWrapped1
