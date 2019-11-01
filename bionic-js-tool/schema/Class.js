const {MultiTargetGenerable} = require('./MultiTargetGenerable')
const {Constructor} = require('./Constructor')
const {Method} = require('./Method')
const {Property} = require('./Property')
const {Validation} = require('./Validation')
const path = require('path')

class Class extends MultiTargetGenerable {

    static get schemaName() {
        return 'Class'
    }

    static fromObj(obj) {
        return new Class(obj.name, obj.description, Constructor.fromObjList(obj.constructors),
            Property.fromObjList(obj.properties), Method.fromObjList(obj.methods), obj.superclassName, obj.modulePath)
    }

    constructor(name, description, constructors, properties, methods, superclassName, modulePath) {
        super()
        Object.assign(this, {name, description, constructors, properties, methods, superclassName, modulePath})
    }

    get isValid() {
        return Validation.validateIdentifier('class name', this.name)
    }

    get moduleLoadingPath() {
        const pathComponents = path.parse(this.modulePath)
        return path.join('/', pathComponents.dir, pathComponents.name)
    }
}

module.exports = {Class}