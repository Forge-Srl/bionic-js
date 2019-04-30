const SchemaWithGenerators = require('./SchemaWithGenerators')
const Constructor = require('./Constructor')
const Method = require('./Method')
const Property = require('./Property')
const Validation = require('./Validation')

class Class extends SchemaWithGenerators {

    static get schemaName() {
        return 'Class'
    }

    static fromObj(obj) {
        return new Class(obj.name, obj.description, Constructor.fromObjList(obj.constructors),
            Property.fromObjList(obj.properties), Method.fromObjList(obj.methods), obj.superClassName, obj.modulePath)
    }

    constructor(name, description, constructors, properties, methods, superClassName, modulePath) {
        super()
        Object.assign(this, {name, description, constructors, properties, methods, superClassName, modulePath})
    }

    get isValid() {
        return Validation.validateIdentifier('class name', this.name)
    }
}

module.exports = Class