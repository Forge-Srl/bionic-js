const {BaseEngine} = require('./BaseEngine')
require('../libs/FuelType')

// @bionic native
class Engine extends BaseEngine {

    // @bionic (FuelType)
    constructor(fuelType) {
        super()
    }

    // @bionic FuelType
    get fuelType() {
    }
}

module.exports = {Engine}
