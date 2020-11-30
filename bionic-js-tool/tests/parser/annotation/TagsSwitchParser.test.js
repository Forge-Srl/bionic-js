const t = require('../../test-utils')

describe('Tags switch parser', () => {

    let Parser

    beforeEach(() => {
        Parser = t.requireModule('parser/annotation/Parser')
    })

    const parse = input => Parser.parse(input, {startRule: 'Tags'})


    const unknownTag = 'UnknownTag'

    test('parse unsupported tag', () => {
        expect(parse('@unsupported')).toEqual(unknownTag)
    })

    test('parse supported tag typo', () => {
        expect(parse('@descr description')).toEqual(unknownTag)
    })

    test('parse supported tag typo 2', () => {
        expect(parse('@bionico')).toEqual(unknownTag)
    })


    const bionicTag = 'BionicTag'

    test('parse bionic tag empty', () => {
        expect(parse('@bionic')).toEqual(bionicTag)
    })

    test('parse bionic tag', () => {
        expect(parse('@bionic tag syntax')).toEqual(bionicTag)
    })

    test('parse bionic tag multiple lines', () => {
        expect(parse('@bionic tag syntax\n on two lines\n or three')).toEqual(bionicTag)
    })


    const descriptionTag = "DescriptionTag"

    test('parse description tag empty', () => {
        expect(parse('@desc')).toEqual(descriptionTag)
        expect(parse('@description')).toEqual(descriptionTag)
    })

    test('parse description tag', () => {
        expect(parse('@desc tag syntax')).toEqual(descriptionTag)
        expect(parse('@description tag syntax')).toEqual(descriptionTag)
    })

    test('parse description tag multiple lines', () => {
        expect(parse('@desc tag syntax\n on two lines\n or three')).toEqual(descriptionTag)
        expect(parse('@description tag syntax\n on two lines\n or three')).toEqual(descriptionTag)
    })
})