const {MotorVehicle} = require('./libs/MotorVehicle')

class TeslaRoadster extends MotorVehicle {

    // @bionic TeslaRoadster
    static get default() {
        return new TeslaRoadster()
    }

    constructor() {
        super(1140, 2, 201, 'electricity', 392, 300)
    }

    // @bionic JsRef
    get serialized() {
        return {json: JSON.stringify(this)}
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
