const {MethodSchemaCreator} = require('./MethodSchemaCreator')

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

    getSuperClassesSchemaCreators(classSchemaCreators, hierarchySet = new Set()) {
        const superClassName = this.classExplorer.superClassName
        if (hierarchySet.has(classSchemaCreators)) {
            throw new Error(`Class "${this.name}" extends super class "${superClassName}" but this generate an` +
                'inheritance cycle (e.g. A extends B, B extends A)')
        }
        const superClassSchemaCreator = classSchemaCreators.get(superClassName)
        if (superClassSchemaCreator) {
            hierarchySet.add(superClassName)
            return [superClassSchemaCreator,
                superClassSchemaCreator.getSuperClassesSchemaCreators(classSchemaCreators, hierarchySet)]
        } else {
            return []
        }
    }

    getSchema(classSchemaCreators) {
        const methodNames = [...new Set(this.classExplorer.methodExplorers.map(methodExplorer => methodExplorer.name))]

        return methodNames.map(methodName => new MethodSchemaCreator(
            this.classExplorer.methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
        ).getSchema(classSchemaCreators))
    }
}

module.exports = {ClassSchemaCreator}