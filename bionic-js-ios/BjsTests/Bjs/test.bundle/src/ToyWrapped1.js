const native = require('ToyWrapped1')

class ToyWrapped1 {
    
    // @bionic (String, String)
    constructor(number1, number2) {
        native.bjsBind(this, number1, number2)
    }
    
    // @bionic (Int) => Int
    getSum(offset) {
        return native.getSum(this, offset)
    }
    
    // @bionic (ToyWrapped1) => Int
    getToySum(toy) {
        return native.getToySum(this, toy)
    }
}

module.exports = ToyWrapped1
