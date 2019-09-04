const t = require('../../test-utils')

describe('@description tag parser', () => {

    let Parser

    beforeEach(() => {
        Parser = t.requireModule('parser/annotation/Parser')
    })

    const parse = input => Parser.parse(input, {startRule: 'DescriptionTag'})

    test('parse another tag', () => {
        expect(() => parse(`@anotherTag`)).toThrow()
    })

    test('parse similar tag', () => {
        expect(() => parse(`@descr`)).toThrow()
    })

    test('parse empty tag', () => {
        expect(parse('@desc')).toBe('')
    })

    test('parse empty tag with trim', () => {
        expect(parse('@description    \n\t\n  ')).toBe('')
    })

    test('parse single line', () => {
        expect(parse('@description this is the desc')).toBe('this is the desc')
    })

    test('parse multiple lines', () => {
        expect(parse('@description this is the desc\nanother line\n.')).toBe('this is the desc\nanother line\n.')
    })
})