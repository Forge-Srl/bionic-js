const {Car} = require('./Car')
const {GasStation} = require('./native/GasStation')

class TeslaRoadster extends Car {

    constructor() {
        super(1140, 2, 201, 392, 300)
    }

    get name() {
        return 'Tesla Roadster'
    }

    // @bionic String
    static get gasStation() {
        return new GasStation('electricity')
    }

    // @bionic Bool
    get canTravelInTheSpace() {
        return true
    }
}

module.exports = {TeslaRoadster}
