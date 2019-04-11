const SchemaWithGenerators = require('./SchemaWithGenerators')
const Constructor = require('./Constructor')
const Method = require('./Method')
const Property = require('./Property')
const Validation = require('./Validation')

class Class extends SchemaWithGenerators {

    get isValid() {
        return Validation.validateIdentifier('class name', this.name)
    }

    constructor(name, description, constructors, properties, methods, superClassName, modulePath) {
        super()
        Object.assign(this, {name, description, constructors, properties, methods, superClassName, modulePath})
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../generation/host/${directory}/${classPrefix}ClassGenerator`)
    }

    static fromObj(obj) {
        return new Class(obj.name, obj.description, Constructor.fromObjList(obj.constructors),
            Property.fromObjList(obj.properties), Method.fromObjList(obj.methods), obj.superClassName, obj.modulePath)
    }
}

module.exports = Class