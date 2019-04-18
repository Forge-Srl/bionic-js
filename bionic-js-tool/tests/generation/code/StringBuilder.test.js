const t = require('../../test-utils')

describe('StringBuilder', () => {
    let stringBuilder

    beforeEach(() => {
        let StringBuilder = t.requireModule('generation/code/StringBuilder')
        stringBuilder = new StringBuilder()
    })

    test('append two strings', () => {
        stringBuilder.append('text')
        expect(stringBuilder.getString()).toBe('text')

        stringBuilder.append(' another text')
        expect(stringBuilder.getString()).toBe('text another text')
    })

    test('return empty string', () => {
        expect(stringBuilder.getString()).toBe('')
    })

})