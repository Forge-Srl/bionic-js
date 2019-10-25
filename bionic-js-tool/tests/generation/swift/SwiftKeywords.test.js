const t = require('../../test-utils')

describe('SwiftKeywords', () => {

    let SwiftKeywords

    beforeEach(() => {
        SwiftKeywords = t.requireModule('generation/swift/SwiftKeywords').SwiftKeywords
    })

    test('getSafeIdentifier, safe identifier', () => {
        expect(SwiftKeywords.getSafeIdentifier('itsSafe')).toBe('itsSafe')
    })

    test('getSafeIdentifier, unsafe identifier', () => {
        expect(SwiftKeywords.getSafeIdentifier('default')).toBe('`default`')
    })
})