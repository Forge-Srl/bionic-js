const t = require('../../../test-utils')

describe('InlineCode', () => {
    let InlineCode

    beforeEach(() => {
        InlineCode = t.requireModule('generation/code/codeElements/InlineCode').InlineCode
    })

    test('construct with string', () => {
        const inlineCode = new InlineCode('code')

        expect(inlineCode.codeString).toBe('code')
    })

    test('appendToBuilder', () => {
        const inlineCode = new InlineCode()
        inlineCode.codeString = 'codeToAppend'

        const stringBuilder = {append: t.mockFn()}
        expect(inlineCode.appendToBuilder(stringBuilder, 1)).toBe(1)
        expect(stringBuilder.append).toBeCalledWith('codeToAppend')
    })
})