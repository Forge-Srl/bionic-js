const t = require('../../../common')

describe('Indentation', () => {
    let Indentation, indStr = '    '

    beforeEach(() => {
        Indentation = t.requireModule('generation/code/codeElements/Indentation')
    })

    test('indentationString', () => {
        expect(Indentation.indentationString).toBe(indStr)
    })

    test('construct', () => {
        const newLine = new Indentation()

        expect(newLine.indentation).toBe(0)
    })

    test('construct with indentation', () => {
        const newLine = new Indentation(3)

        expect(newLine.indentation).toBe(3)
    })

    test('appendToBuilder with no indentation', () => {
        const newLine = new Indentation(0)

        const stringBuilder = {append: t.mockFn()}

        expect(newLine.appendToBuilder(stringBuilder, 0)).toBe(0)
        expect(newLine.appendToBuilder(stringBuilder, 0)).toBe(0)

        expect(stringBuilder.append.mock.calls).toEqual([])
    })

    test('appendToBuilder with inherited indentation', () => {
        const newLine = new Indentation(0)

        const stringBuilder = {append: t.mockFn()}

        expect(newLine.appendToBuilder(stringBuilder, 1)).toBe(1)
        expect(newLine.appendToBuilder(stringBuilder, 2)).toBe(2)

        expect(stringBuilder.append.mock.calls).toEqual([[indStr], [indStr + indStr]])
    })

    test('appendToBuilder with initial indentation', () => {
        const newLine = new Indentation(2)

        const stringBuilder = {append: t.mockFn()}

        expect(newLine.appendToBuilder(stringBuilder, 0)).toBe(2)
        expect(newLine.appendToBuilder(stringBuilder, 1)).toBe(3)

        expect(stringBuilder.append.mock.calls).toEqual([[indStr + indStr], [indStr + indStr + indStr]])
    })
})