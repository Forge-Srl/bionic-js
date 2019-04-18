const t = require('../../test-utils')
const parser = require('@babel/parser')
const ParameterExplorer = t.requireModule('parser/explorers/ParameterExplorer')

describe('ParameterExplorer', () => {

    function getExplorer(code) {
        const classNode = parser.parse(code, {sourceType: 'module'}).program.body[0]
        const methodNode = classNode.body.body[0]
        return new ParameterExplorer(methodNode.params[0])
    }

    test('name of parameter', () => {
        const explorer = getExplorer(`
            class Class1 {
                method1(parameter1) {}
            }`)

        const parameterName = explorer.name
        expect(parameterName).toBe('parameter1')
    })

    test('name of rest parameter', () => {
        const explorer = getExplorer(`
            class Class1 {
                method1(...parameters) {}
            }`)

        const parameterName = explorer.name
        expect(parameterName).toBe('parameters')
    })


    test('rest of parameter', () => {
        const explorer = getExplorer(`
            class Class1 {
                method1(parameter1) {}
            }`)

        const isParameterRest = explorer.rest
        expect(isParameterRest).toBe(false)
    })

    test('rest of rest parameter', () => {
        const explorer = getExplorer(`
            class Class1 {
                method1(...parameters) {}
            }`)

        const isParameterRest = explorer.rest
        expect(isParameterRest).toBe(true)
    })


    test('topComment', () => {
        const explorer = getExplorer(`
            class Class1 {
                method1( /* Skipped annotation */ /* Annotation1 */ parameter1, /* Annotation2 */ parameter2) {}
            }`)

        const topComment = explorer.topCommentText
        expect(topComment).toEqual(' Annotation1 ')
    })
})