const {MotorVehicle} = require('./libs/MotorVehicle')

// @bionic
class Car extends MotorVehicle {

    get name() {
        return 'car'
    }
}

module.exports = {Car}
