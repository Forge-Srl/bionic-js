const {MethodSchemaCreator} = require('./MethodSchemaCreator')
const {Class} = require('../schema/Class')
const {Constructor} = require('../schema/Constructor')
const {Property} = require('../schema/Property')
const {Method} = require('../schema/Method')

class ClassSchemaCreator {

    constructor(classExplorer) {
        Object.assign(this, {classExplorer})
    }

    get name() {
        return this.classExplorer.name
    }

    get modulePath() {
        return this.classExplorer.modulePath
    }

    getSchema(moduleCreators) {
        if (!this._schema) {
            const moduleCreatorsMap = new Map(moduleCreators.map(moduleCreator => [moduleCreator.name, moduleCreator]))
            this._schema = this.buildSchema(moduleCreatorsMap, [])
        }
        return this._schema
    }

    buildSchema(moduleCreatorsMap, currentSuperclassSchemas) {
        if (!this._schema) {
            try {
                const methodNames = [...new Set(this.classExplorer.methodExplorers.map(methodExplorer => methodExplorer.name))]
                const superclassSchemas = this.buildSuperclassSchemas(moduleCreatorsMap, currentSuperclassSchemas)
                const methodCreatorContext = this.buildMethodCreatorContext(moduleCreatorsMap, superclassSchemas)
                const methodSchemas = methodNames.map(methodName => new MethodSchemaCreator(
                    this.classExplorer.methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
                    methodCreatorContext,
                ).schema)

                const superclassModuleCreator = moduleCreatorsMap.get(this.classExplorer.superclassName)
                const superclassName = superclassModuleCreator ? superclassModuleCreator.name : null

                this._schema = new Class(
                    this.name,
                    this.classExplorer.description,
                    methodSchemas.filter(method => method instanceof Constructor),
                    methodSchemas.filter(method => method instanceof Property),
                    methodSchemas.filter(method => method instanceof Method),
                    superclassName,
                    this.modulePath)
            } catch (error) {
                error.message = `extracting schema from class ${this.name} in module "${this.modulePath}"\n${error.message}`
                throw error
            }
        }
        return this._schema
    }

    buildSuperclassSchemas(moduleCreatorsMap, currentSuperclassSchemas) {
        const superclassName = this.classExplorer.superclassName

        const superclassModuleCreator = moduleCreatorsMap.get(superclassName)
        if (!superclassModuleCreator) {
            return currentSuperclassSchemas
        }

        if (currentSuperclassSchemas.some(schema => schema.name === superclassName)) {
            throw new Error(`class "${this.name}" extends superclass "${superclassName}" but this generates an ` +
                'inheritance cycle (e.g. A extends B, B extends A)')
        }
        return [superclassModuleCreator.classSchemaCreator.buildSchema(moduleCreatorsMap, currentSuperclassSchemas), ...currentSuperclassSchemas]
    }

    buildMethodCreatorContext(moduleCreatorsMap, superclassSchemas) {
        const exportedModules = [...moduleCreatorsMap.values()]
        return {
            superclassMethodNames: new Set(superclassSchemas.map(schema => schema.methods.map(method => method.name)).flat()),
            superclassPropertyNames: new Set(superclassSchemas.map(schema => schema.properties.map(property => property.name)).flat()),
            jsModuleNames: new Set(exportedModules.filter(module => !module.isNative).map(module => module.name)),
            nativeModuleNames: new Set(exportedModules.filter(module => module.isNative).map(module => module.name)),
        }
    }
}

module.exports = {ClassSchemaCreator}