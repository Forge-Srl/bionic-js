const {fuelCosts} = require('./fuelCosts')

class GasStation {

    // @bionic (String)
    constructor(fuel) {
    }

    // @bionic get fuel String

    get fuelCost() {
        return fuelCosts[this.fuel]
    }

    // @bionic (MotorVehicle) => Bool
    refuel(vehicle) {
    }
}

module.exports = {GasStation}
