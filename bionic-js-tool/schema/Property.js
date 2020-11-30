const {Generable} = require('./Generable')
const {Type} = require('./types/Type')

class Property extends Generable {

    static get schemaName() {
        return 'Property'
    }

    static fromObj(obj) {
        return new Property(obj.name, obj.description, obj.isStatic, Type.fromObj(obj.type), obj.kinds.slice())
    }

    constructor(name, description, isStatic, type, kinds) {
        super()
        Object.assign(this, {name, description, isStatic, type, kinds})
    }

    resolveClassType(nativeClassesMap) {
        return new Property(this.name, this.description, this.isStatic, this.type.resolveClassType(nativeClassesMap), this.kinds)
    }
}

module.exports = {Property}