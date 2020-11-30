const t = require('../../test-utils')

describe('SwiftParameterGenerator', () => {

    let SwiftParameterGenerator

    beforeEach(() => {

        SwiftParameterGenerator = t.requireModule('generation/swift/SwiftParameterGenerator').SwiftParameterGenerator
    })

    test('getTypeStatement', () => {

        const generator = new SwiftParameterGenerator({
            name: 'paramName', type: {generator: {swift: {getTypeStatement: () => 'type_statement'}}},
        })

        const parameterStatement = generator.getParameterStatement()

        expect(parameterStatement).toBe('_ paramName: type_statement')
    })

    test('getTypeStatement, missing parameter name', () => {

        const generator = new SwiftParameterGenerator({
            type: {generator: {swift: {getTypeStatement: () => 'type_statement'}}},
        })

        const parameterStatement = generator.getParameterStatement()

        expect(parameterStatement).toBe('type_statement')
    })
})