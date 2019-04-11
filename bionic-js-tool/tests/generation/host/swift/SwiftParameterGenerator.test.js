const t = require('../../../common')

describe('SwiftParameterGenerator', () => {

    test('getTypeStatement', () => {

        const SwiftParameterGenerator = t.requireModule('generation/host/swift/SwiftParameterGenerator')

        const generator = new SwiftParameterGenerator({
            name: 'paramName', type: {getSwiftGenerator: () => ({getTypeStatement: () => 'type_statement'})},
        })

        const parameterStatement = generator.getParameterStatement()

        expect(parameterStatement).toBe('_ paramName: type_statement')
    })
})