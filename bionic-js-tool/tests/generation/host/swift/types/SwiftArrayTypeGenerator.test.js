const t = require('../../../../common')

describe('SwiftArrayTypeGenerator', () => {

    test('getTypeStatement', () => {
        const SwiftArrayTypeGenerator = t.requireModule('generation/host/swift/types/SwiftArrayTypeGenerator')
        const generator = new SwiftArrayTypeGenerator({
            elementType: {getSwiftGenerator: () => ({getTypeStatement: () => 'el_type_statement'})},
        })

        expect(generator.getTypeStatement()).toBe('[el_type_statement]?')
    })
})