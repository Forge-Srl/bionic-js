const {Vehicle} = require('./libs/Vehicle')

class Bicycle extends Vehicle {

    constructor(weight, maxSpeed) {
        super(weight, 1, maxSpeed)
    }

    // @bionic
    ride() {
    }
}

module.exports = {Bicycle}
