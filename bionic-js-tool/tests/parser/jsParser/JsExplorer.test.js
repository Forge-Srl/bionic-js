const t = require('../../test-utils')
const parser = require('@babel/parser')
const JsExplorer = t.requireModule('parser/jsExplorer/JsExplorer').JsExplorer

describe('JsExplorer', () => {

    function getExplorer(code) {
        return new JsExplorer(parser.parse(code, {sourceType: 'module'}).program.body[0])
    }

    const code = `
            // Skipped annotation
            // Annotation
            let variable = 'value';`

    test('topComment', () => {
        const explorer = getExplorer(code)
        const topComment = explorer.topComment
        expect(topComment.start).toEqual(47)
        expect(topComment.end).toEqual(60)
    })

    test('topCommentText', () => {
        const explorer = getExplorer(code)
        const topComment = explorer.topCommentText
        expect(topComment).toEqual(' Annotation')
    })

    test('annotationTags', () => {
        const explorer = new JsExplorer()
        t.mockGetter(explorer, 'topCommentText', () => '@desc desc')
        const tags = explorer.annotationTags

        expect(tags.get('DescriptionTag')).toEqual('desc')
    })
})