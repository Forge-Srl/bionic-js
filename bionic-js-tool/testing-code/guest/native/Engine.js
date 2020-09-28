const {fuelCosts} = require('./fuelCosts')
const {BaseEngine} = require('./BaseEngine')

// @bionic native
class Engine extends BaseEngine {
    
    // @bionic String
    get fuelType() {
    }
    
    get fuelCost() {
        return fuelCosts[this.fuelType]
    }
}

module.exports = {Engine}
