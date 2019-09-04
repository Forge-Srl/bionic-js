const {MethodSchemaCreator} = require('./MethodSchemaCreator')

class ClassSchemaCreator {

    constructor(classExplorer) {
        Object.assign(this, {classExplorer})
    }

    async getSchema(parsingSession) {
        const methodExplorers = this.classExplorer.methodExplorers
        const methodParsers = this.classExplorer.methodParsers

        const methodsNames = [...new Set([
            ...methodExplorers.map(explorer => explorer.name),
            ...methodParsers.map(parser => parser.name),
        ])]

        const methodSchemaCreators = methodsNames.map(methodName => new MethodSchemaCreator(
            methodExplorers.filter(methodExplorer => methodExplorer.name === methodName),
            methodParsers.filter(methodParser => methodParser.name === methodName),
        ))

        return methodSchemaCreators.map(schemaCreator => schemaCreator.getSchema(parsingSession))
    }
}

module.exports = {ClassSchemaCreator}