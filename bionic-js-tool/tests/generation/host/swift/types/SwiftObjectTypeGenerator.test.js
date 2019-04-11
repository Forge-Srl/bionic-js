const t = require('../../../../common')

describe('SwiftObjectTypeGenerator', () => {

    test('getTypeStatement', () => {
        const SwiftClassTypeGenerator = t.requireModule('generation/host/swift/types/SwiftObjectTypeGenerator')

        const generator = new SwiftClassTypeGenerator({className: 'ClassName'})

        expect(generator.getTypeStatement()).toBe('ClassName?')
    })

    test('getNativeIniRet', () => {
        const SwiftClassTypeGenerator = t.requireModule('generation/host/swift/types/SwiftObjectTypeGenerator')

        const generator = new SwiftClassTypeGenerator({className: 'ClassName'})

        expect(generator.getTypeStatement()).toBe('ClassName?')
    })
})