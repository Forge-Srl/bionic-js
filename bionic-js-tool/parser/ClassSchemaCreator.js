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

    getSuperclassSchemaStack(classSchemaCreators, superclassSchemaStack) {
        const superclassName = this.classExplorer.superclassName

        const superclassSchemaCreator = classSchemaCreators.get(superclassName)
        if (!superclassSchemaCreator) {
            return superclassSchemaStack
        }

        if (superclassSchemaStack.some(schema => schema.name === superclassName)) {
            throw new Error(`class "${this.name}" extends superclass "${superclassName}" but this generates an ` +
                'inheritance cycle (e.g. A extends B, B extends A)')
        }
        return [superclassSchemaCreator.getSchema(classSchemaCreators, superclassSchemaStack), ...superclassSchemaStack]
    }

    getSchema(classSchemaCreators, superclassSchemaStack = []) {
        if (!this._schema) {
            try {
                const methodNames = [...new Set(this.classExplorer.methodExplorers.map(methodExplorer => methodExplorer.name))]
                const newSuperclassSchemaStack = this.getSuperclassSchemaStack(classSchemaCreators, superclassSchemaStack)
                const methodSchemas = methodNames.map(methodName => new MethodSchemaCreator(
                    this.classExplorer.methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
                    newSuperclassSchemaStack,
                ).schema)

                const superclassSchemaCreator = classSchemaCreators.get(this.classExplorer.superclassName)
                const superclassName = superclassSchemaCreator ? superclassSchemaCreator.name : null

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
}

module.exports = {ClassSchemaCreator}