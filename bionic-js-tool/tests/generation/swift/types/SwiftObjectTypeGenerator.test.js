const t = require('../../../test-utils')

describe('SwiftObjectTypeGenerator', () => {

    test('getTypeStatement', () => {
        const SwiftClassTypeGenerator = t.requireModule('generation/swift/types/SwiftObjectTypeGenerator')

        const generator = new SwiftClassTypeGenerator({className: 'ClassName'})

        expect(generator.getTypeStatement()).toBe('ClassName?')
    })
})