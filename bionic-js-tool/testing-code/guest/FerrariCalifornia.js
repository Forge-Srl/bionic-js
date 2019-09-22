const {Car} = require('./Car')
const {GasStation} = require('./native/GasStation')

class FerrariCalifornia extends Car {

    constructor() {
        super(1660, 2, 312, 500, 250)
    }

    get name() {
        return 'Ferrari California'
    }

    // @bionic String
    static get gasStation() {
        return new GasStation('petrol')
    }
}

module.exports = {FerrariCalifornia}
