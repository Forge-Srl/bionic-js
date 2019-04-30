const ToyWrapped1 = require('./ToyWrapped1')

class ToyWrapped1User {
    
    // @bionic (Int, Int, Int) => Void
    static add(offset, int1, int2) {
        const toy = new ToyWrapped1(int1, int2)
        return toy.getSum(offset)
    }
    
    // @bionic (Int, Int) => ToyWrapped1
    static getToy(int1, int2) {
        return new ToyWrapped1(`${int1}`, `${int2}`)
    }
    
    // @bionic (ToyWrapped1) => Int
    static getSum(toy1, toy2) {
        return toy1.getToySum(toy2)
    }
}

module.exports = ToyWrapped1User
