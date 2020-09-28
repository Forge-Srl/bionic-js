const {Generable} = require('./Generable')
const {Parameter} = require('./Parameter')

class Constructor extends Generable {

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

    resolveClassType(nativeClassesMap) {
        return new Constructor(this.description,
            this.parameters.map(parameter => parameter.resolveClassType(nativeClassesMap)))
    }
}

module.exports = {Constructor}