const {fuelCosts} = require('./fuelCosts')

class Engine {

    constructor() {
    }

    // @bionic String
    get fuelType() {
    }

    get fuelCost() {
        return fuelCosts[this.fuelType]
    }

    // @bionic ()
    powerOn() {
    }

    // @bionic
    powerOff() {
    }

    // @bionic method watch (callback: () => String)
}

module.exports = {Engine}
