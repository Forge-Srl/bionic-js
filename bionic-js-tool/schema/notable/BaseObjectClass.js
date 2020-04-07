const {Class} = require('../Class')

class BaseObjectClass extends Class {

    constructor() {
        super('BjsBaseObject', '', [], [], [], null, null)
    }

    get isBaseObjectClass() {
        return true
    }
}

module.exports = {BaseObjectClass}