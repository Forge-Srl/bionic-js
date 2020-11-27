const {Bicycle} = require('./Bicycle')

class GannaBicycle extends Bicycle {

    constructor() {
        super(4, 80)
    }

    get name() {
        return 'Ganna Bicycle'
    }
}

module.exports = {GannaBicycle}
