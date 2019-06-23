const {MultiTargetGenerable} = require('./MultiTargetGenerable')
const {Type} = require('./types/Type')

class Property extends MultiTargetGenerable {

    static get schemaName() {
        return 'Property'
    }

    static fromObj(obj) {
        return new Property(obj.name, obj.description, obj.isStatic, obj.isOverriding, Type.fromObj(obj.type),
            obj.kinds.slice())
    }

    constructor(name, description, isStatic, isOverriding, type, kinds) {
        super()
        Object.assign(this, {name, description, isStatic, isOverriding, type, kinds})
    }
}

module.exports = {Property}