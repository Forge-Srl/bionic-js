const {Vehicle} = require('./Vehicle')
const {Engine} = require('../native/Engine')

class MotorVehicle extends Vehicle {

    constructor(weight, seats, maxSpeed, fuelType, maxRange, currentRange) {
        super(weight, seats, maxSpeed)
        this.engine = new Engine(fuelType)
        this.maxRange = maxRange
        this.currentRange = currentRange
    }

    // @bionic get engine Engine

    get description() {
        return `${super.description}, it has an engine powered by ${this.engine.fuelType} with ${this.maxRange} km of range`
    }

    // @bionic Bool
    get isOnReserve() {
        return this.currentRange < 100
    }

    // @bionic () => Float
    refuel() {
        const missingRange = this.maxRange - this.currentRange
        this.currentRange = this.maxRange
        return this.engine.fuelCost * missingRange
    }

    // @bionic (() => String)
    watchEngine(observer) {
        this.engine.watch(observer)
    }
}

module.exports = {MotorVehicle}
