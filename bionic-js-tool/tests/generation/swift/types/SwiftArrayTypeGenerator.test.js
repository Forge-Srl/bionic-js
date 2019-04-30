const t = require('../../../test-utils')

describe('SwiftArrayTypeGenerator', () => {

    test('getTypeStatement', () => {
        const SwiftArrayTypeGenerator = t.requireModule('generation/swift/types/SwiftArrayTypeGenerator')
        const generator = new SwiftArrayTypeGenerator({
            elementType: {getSwiftGenerator: () => ({getTypeStatement: () => 'el_type_statement'})},
        })

        expect(generator.getTypeStatement()).toBe('[el_type_statement]?')
    })
})