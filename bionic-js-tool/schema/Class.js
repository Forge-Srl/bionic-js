const {Generable} = require('./Generable')
const {Constructor} = require('./Constructor')
const {Method} = require('./Method')
const {Property} = require('./Property')
const {Validation} = require('./Validation')
const path = require('path')
const nativeObjectBaseClassName = 'BjsNativeObject'

class Class extends Generable {

    static get schemaName() {
        return 'Class'
    }

    static fromObj(obj) {
        return new Class(obj.name, obj.description, Constructor.fromObjList(obj.constructors),
            Property.fromObjList(obj.properties), Method.fromObjList(obj.methods),
            Class.fromNullableObj(obj.superclass), obj.isNative, obj.modulePath)
    }

    constructor(name, description, constructors, properties, methods, superclass, isNative, modulePath) {
        super()
        Object.assign(this, {name, description, constructors, properties, methods, superclass, isNative, modulePath})
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

    resolveClassType(nativeClassesMap) {
        return new Class(this.name, this.description,
            this.constructors.map(constructor => constructor.resolveClassType(nativeClassesMap)),
            this.properties.map(property => property.resolveClassType(nativeClassesMap)),
            this.methods.map(method => method.resolveClassType(nativeClassesMap)),
            this.superclass ? this.superclass.resolveClassType(nativeClassesMap) : null, this.isNative, this.modulePath)
    }
}

module.exports = {Class, nativeObjectBaseClassName}