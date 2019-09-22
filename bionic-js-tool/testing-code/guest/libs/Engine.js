class Engine {

    constructor() {
        this._state = 'off'
    }

    get state() {
        return `the engine is ${this._state}`
    }

    powerOn() {
        this._state = 'on'
    }

    powerOff() {
        this._state = 'on'
    }
}

module.exports = {Engine}
