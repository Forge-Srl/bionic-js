const t = require('../../test-utils')

describe('MethodAnnotationExplorer', () => {

    let LambdaType, MethodAnnotationExplorer

    beforeEach(() => {
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
        MethodAnnotationExplorer = t.requireModule('parser/jsExplorer/MethodAnnotationExplorer').MethodAnnotationExplorer
    })

    test('bionicTag - no bionic tags', () => {
        const bionicTag = new MethodAnnotationExplorer('@unknown tag').bionicTag
        expect(bionicTag).toBe(undefined)
    })

    const annotation = '@bionic static get set method (Float) => Int'

    test('name', () => {
        expect(new MethodAnnotationExplorer(annotation).name).toBe('method')
    })

    test('kinds', () => {
        expect(new MethodAnnotationExplorer(annotation).kinds).toStrictEqual(['get', 'set'])
    })

    test('static', () => {
        expect(new MethodAnnotationExplorer(annotation).static).toBe(true)
    })

    test('generator', () => {
        expect(new MethodAnnotationExplorer().generator).toBe(false)
    })

    test('async', () => {
        expect(new MethodAnnotationExplorer(annotation).async).toBe(false)
    })

    test('type', () => {
        const type = new MethodAnnotationExplorer(annotation).type
        expect(type).toBeInstanceOf(LambdaType)
        expect(type).toEqual({
            parameters: [{type: {typeName: 'Float'}}],
            returnType: {typeName: 'Int'},
            typeName: 'Lambda',
        })
    })

    test('signature', () => {
        const parser = new MethodAnnotationExplorer(annotation)
        const lambdaType = new LambdaType()
        t.mockGetter(parser, 'type', () => lambdaType)

        expect(parser.signature).toBe(lambdaType)
    })

    test('signature, type is not a lambda', () => {
        const parser = new MethodAnnotationExplorer(annotation)
        const notLambdaType = 'not a lambda'
        t.mockGetter(parser, 'name', () => 'methodName')
        t.mockGetter(parser, 'type', () => notLambdaType)

        expect(() => parser.signature).toThrow('Method named "methodName" has an annotations without a lambda type definition')
    })
})