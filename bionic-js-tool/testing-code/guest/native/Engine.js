const {fuelCosts} = require('./fuelCosts')

class Engine {

    constructor(fuelType) {
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

    // @bionic method watch (() => String)
}

module.exports = {Engine}
