const t = require('../../../common')

describe('NewLine', () => {

    test('appendToBuilder', () => {
        const NewLine = t.requireModule('generation/code/codeElements/NewLine')
        const newLine = new NewLine()

        const stringBuilder = {append: t.mockFn()}

        expect(newLine.appendToBuilder(stringBuilder, 1)).toBe(1)
        expect(newLine.appendToBuilder(stringBuilder, 2)).toBe(2)

        expect(stringBuilder.append.mock.calls).toEqual([['\n'], ['\n']])
    })
})