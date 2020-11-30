const {Vehicle} = require('./Vehicle')
const {Engine} = require('../native/Engine')
const {ModuleA} = require('module-a')

class MotorVehicle extends Vehicle {

    // @bionic (Int, Int, Int, FuelType, Float, Float)
    constructor(weight, seats, maxSpeed, fuelType, maxRange, currentRange) {
        super(weight, seats, maxSpeed)
        this.engine = new Engine(fuelType)
        this.maxRange = maxRange
        this.currentRange = currentRange
    }

    // @bionic get engine Engine
    // @bionic get rawEngine NativeRef<Engine>
    // @bionic get delegate AppDelegate

    get description() {
        return `${super.description}, it has an engine powered by ${this.engine.fuelType.name} with ${this.maxRange} km of range`
    }

    // @bionic Bool
    get isOnReserve() {
        return this.currentRange < 100
    }

    // @bionic () => Float
    refuel() {
        const missingRange = this.maxRange - this.currentRange
        this.currentRange = this.maxRange
        return this.engine.fuelType.cost * missingRange
    }

    // @bionic (() => String)
    watchEngine(observer) {
        this.engine.watch(observer)
    }
}

module.exports = {MotorVehicle}
