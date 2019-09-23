const {MotorVehicle} = require('./libs/MotorVehicle')

// @bionic
class FerrariCalifornia extends MotorVehicle {

    constructor() {
        super(1660, 2, 312, 'petrol', 500, 250)
    }

    get name() {
        return 'Ferrari California'
    }
}

module.exports = {FerrariCalifornia}
