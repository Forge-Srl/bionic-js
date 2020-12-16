const t = require('../../test-utils')
const parser = require('@babel/parser')
const JsExplorer = t.requireModule('parser/jsExplorer/JsExplorer').JsExplorer

describe('JsExplorer', () => {

    function getExplorer(code) {
        return new JsExplorer(parser.parse(code, {sourceType: 'module'}).program.body[0])
    }

    const code =
        '// Skipped annotation\n' +
        '/* Last\n' +
        '* annotation\n' +
        '*/\n' +
        'let variable = "value";\n'

    test('topComment', () => {
        const explorer = getExplorer(code)
        const topComment = explorer.topComment
        expect(topComment.start).toEqual(22)
        expect(topComment.end).toEqual(45)
    })

    test('topCommentText', () => {
        const explorer = getExplorer(code)
        const topComment = explorer.topCommentText
        expect(topComment).toEqual(' Last\n* annotation\n')
    })

    test('annotationTags', () => {
        const explorer = new JsExplorer()
        t.mockGetter(explorer, 'topCommentText', () => '@desc desc')
        const tags = explorer.annotationTags

        expect(tags.get('DescriptionTag')).toEqual('desc')
    })


    test('bionicTag', () => {
        const explorer = getExplorer('// @bionic \nclass Class1 {}')
        expect(explorer.bionicTag).toEqual({})
    })

    test('bionicTag with inline export', () => {
        const explorer = getExplorer('// @bionic\nexport class Class1 {}')
        expect(explorer.bionicTag).toEqual({})
    })

    test('bionicTag - not present', () => {
        const explorer = getExplorer('// @unknown tag \nclass Class1 {}')
        expect(explorer.bionicTag).toBe(undefined)
    })

    test('description', () => {
        const explorer = getExplorer('/* @desc desc */ class Class1 {}')
        expect(explorer.description).toEqual('desc')
    })

    test('description, not present', () => {
        const explorer = getExplorer('class Class1 {}')
        expect(explorer.description).toEqual('')
    })
})