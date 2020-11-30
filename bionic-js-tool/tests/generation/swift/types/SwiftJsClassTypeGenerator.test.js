const t = require('../../../test-utils')

describe('SwiftJsClassTypeGenerator', () => {

    test('getTypeStatement', () => {
        const SwiftJsClassTypeGenerator = t.requireModule('generation/swift/types/SwiftJsClassTypeGenerator').SwiftJsClassTypeGenerator

        const generator = new SwiftJsClassTypeGenerator({className: 'ClassName'})

        expect(generator.getTypeStatement()).toBe('ClassName?')
    })
})