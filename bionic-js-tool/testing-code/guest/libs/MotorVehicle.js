const {Vehicle} = require('./Veichle')
const {Engine} = require('./Engine')

class MotorVehicle extends Vehicle {

    constructor(weight, seats, maxSpeed, maxRange, currentRange) {
        super(weight, seats, maxSpeed)
        this.maxRange = maxRange
        this.currentRange = currentRange
        this.engine = new Engine()
        this.observers = []
    }

    // @bionic get maxRange Float
    // @bionic get currentRange Float

    get description() {
        return `${super.description}, it has ${this.maxRange} km of range`
    }

    // @bionic Bool
    get isOnReserve() {
        return this.currentRange < 100
    }

    // @bionic () => String
    powerOn() {
        this.engine.powerOn()
        this.notifyEngineObservers()
    }

    // @bionic () => String
    powerOff() {
        this.engine.powerOff()
        this.notifyEngineObservers()
    }

    notifyEngineObservers() {
        return this.observers.forEach(observer => observer(this.engine.state))
    }

    // @bionic (() => String)
    watchEngine(observer) {
        this.observers.push(observer)
    }
}

module.exports = {MotorVehicle}
