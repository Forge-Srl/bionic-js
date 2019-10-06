const {MotorVehicle} = require('./libs/MotorVehicle')

class TeslaRoadster extends MotorVehicle {

    constructor() {
        super(1140, 2, 201, 'electricity', 392, 300)
    }

    get name() {
        return 'Tesla Roadster'
    }

    // @bionic Bool
    get canTravelInTheSpace() {
        return true
    }
}

module.exports = {TeslaRoadster}
