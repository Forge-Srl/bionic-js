const {MultiTargetGenerable} = require('./MultiTargetGenerable')
const {Parameter} = require('./Parameter')

class Constructor extends MultiTargetGenerable {

    static get schemaName() {
        return 'Constructor'
    }

    static fromObj(obj) {
        return new Constructor(obj.description, obj.parameters.map(par => Parameter.fromObj(par)))
    }

    constructor(description, parameters) {
        super()
        Object.assign(this, {description, parameters})
    }
}

module.exports = {Constructor}