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

    getSuperclassSchemaStack(classSchemaCreators, superclassSchemaStack) {
        const superclassName = this.classExplorer.superclassName
        if (!superclassName) {
            return superclassSchemaStack
        }

        if (superclassSchemaStack.some(schema => schema.name === superclassName)) {
            throw new Error(`class "${this.name}" extends superclass "${superclassName}" but this generates an ` +
                'inheritance cycle (e.g. A extends B, B extends A)')
        }

        const superclassSchemaCreator = classSchemaCreators.get(superclassName)
        if (!superclassSchemaCreator) {
            throw new Error(`class "${this.name}" extends a superclass "${superclassName}" that has not been exported`)
        }

        return [superclassSchemaCreator.getSchema(classSchemaCreators, superclassSchemaStack), ...superclassSchemaStack]
    }

    getSchema(classSchemaCreators, superclassSchemaStack = []) {
        if (!this._schema) {
            const methodNames = [...new Set(this.classExplorer.methodExplorers.map(methodExplorer => methodExplorer.name))]

            const newSuperclassSchemaStack = this.getSuperclassSchemaStack(classSchemaCreators, superclassSchemaStack)
            const methodSchemas = methodNames.map(methodName => new MethodSchemaCreator(
                this.classExplorer.methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
                newSuperclassSchemaStack,
            ).schema)

            this._schema = new Class(
                this.name,
                this.classExplorer.description,
                methodSchemas.filter(method => method instanceof Constructor),
                methodSchemas.filter(method => method instanceof Property),
                methodSchemas.filter(method => method instanceof Method),
                this.classExplorer.superclassName,
                this.classExplorer.modulePath)
        }
        return this._schema
    }
}

module.exports = {ClassSchemaCreator}