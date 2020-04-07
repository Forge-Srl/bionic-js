const {Generable} = require('./Generable')
const {Constructor} = require('./Constructor')
const {Method} = require('./Method')
const {Property} = require('./Property')
const {Validation} = require('./Validation')
const path = require('path')

class Class extends Generable {

    static get schemaName() {
        return 'Class'
    }

    static fromObj(obj) {
        return new Class(obj.name, obj.description, Constructor.fromObjList(obj.constructors),
            Property.fromObjList(obj.properties), Method.fromObjList(obj.methods),
            Class.fromNullableObj(obj.superclass), obj.modulePath)
    }

    constructor(name, description, constructors, properties, methods, superclass, modulePath) {
        super()
        Object.assign(this, {name, description, constructors, properties, methods, superclass, modulePath})
    }

    get isValid() {
        return Validation.validateIdentifier('class name', this.name)
    }

    get moduleLoadingPath() {
        const pathComponents = path.parse(this.modulePath)
        return path.join(path.sep, pathComponents.dir, pathComponents.name)
    }

    getRelativeModuleLoadingPath(relativeClass) {
        const pathComponents = path.parse(this.moduleLoadingPath)
        const loadingPath = path.relative(pathComponents.dir, relativeClass.moduleLoadingPath)
        return loadingPath.match(/^\./) === null ? `.${path.sep}${loadingPath}` : loadingPath
    }
}

module.exports = {Class}