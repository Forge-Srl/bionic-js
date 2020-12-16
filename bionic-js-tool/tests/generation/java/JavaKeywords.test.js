const t = require('../../test-utils')

describe('JavaKeywords', () => {

    let JavaKeywords

    beforeEach(() => {
        JavaKeywords = t.requireModule('generation/java/JavaKeywords').JavaKeywords
    })

    test('getSafeIdentifier, safe identifier', () => {
        expect(JavaKeywords.getSafeIdentifier('itsSafe')).toBe('itsSafe')
    })

    test('getSafeIdentifier, unsafe identifier', () => {
        expect(JavaKeywords.getSafeIdentifier('default')).toBe('$default$')
    })
})