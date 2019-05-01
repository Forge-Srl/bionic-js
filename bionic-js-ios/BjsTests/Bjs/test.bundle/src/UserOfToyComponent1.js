const ToyComponent1 = require('./ToyComponent1')

class UserOfToyComponent1 {
    
    // @bionic (Int, Int, Int) => Void
    static add(offset, int1, int2) {
        const toy = new ToyComponent1(int1, int2)
        return toy.getSum(offset)
    }
    
    // @bionic (Int, Int) => ToyComponent1
    static getToy(int1, int2) {
        return new ToyComponent1(`${int1}`, `${int2}`)
    }
    
    // @bionic (ToyComponent1, ToyComponent1) => Int
    static getSum(toy1, toy2) {
        return toy1.getToySum(toy2)
    }
}

module.exports = UserOfToyComponent1
