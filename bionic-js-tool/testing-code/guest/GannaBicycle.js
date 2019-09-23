const {Vehicle} = require('./libs/Vehicle')

class GannaBicycle extends Vehicle {

    constructor() {
        super(4, 1, 80)
    }

    get name() {
        return 'Ganna Bicycle'
    }
}

module.exports = {GannaBicycle}
