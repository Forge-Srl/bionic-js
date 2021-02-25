const {MethodSchemaCreator} = require('./MethodSchemaCreator')
const {Class} = require('../schema/Class')
const {Constructor} = require('../schema/Constructor')
const {Property} = require('../schema/Property')
const {Method} = require('../schema/Method')

class ClassSchemaCreator {

    static buildSuperclassInfo(superclassSchemas) {
        return {
            methodNames: new Set(superclassSchemas
                .flatMap(schema => schema.methods.map(method => method.name))),
            propertyNames: new Set(superclassSchemas
                .flatMap(schema => schema.properties.map(property => property.name))),
        }
    }

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
                const methodNames = [...new Set(this.classExplorer.methodExplorers
                    .map(methodExplorer => methodExplorer.name))]
                const superclassSchemas = this.buildSuperclassSchemas(moduleCreatorsMap, currentSuperclassSchemas)
                const superclassInfo = this.constructor.buildSuperclassInfo(superclassSchemas)
                const methodSchemas = methodNames.map(methodName => new MethodSchemaCreator(
                    this.classExplorer.methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
                    superclassInfo,
                ).schema)

                const superclassModuleCreator = moduleCreatorsMap.get(this.classExplorer.superclassName)

                this._schema = new Class(
                    this.name,
                    this.classExplorer.description,
                    methodSchemas.filter(method => method instanceof Constructor),
                    methodSchemas.filter(method => method instanceof Property),
                    methodSchemas.filter(method => method instanceof Method),
                    superclassModuleCreator ? superclassModuleCreator.getSchema(moduleCreatorsMap) : null,
                    this.classExplorer.isNative,
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
            throw new Error(`class "${this.name}" extends superclass "${superclassName}" generating ` +
                'inheritance cycle (e.g. A extends B, B extends A)')
        }
        return [
            superclassModuleCreator.classSchemaCreator.buildSchema(moduleCreatorsMap, currentSuperclassSchemas),
            ...currentSuperclassSchemas
        ]
    }
}

module.exports = {ClassSchemaCreator}