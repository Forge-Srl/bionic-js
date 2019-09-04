const t = require('../../test-utils')
const MethodParser = t.requireModule('parser/annotation/MethodParser').MethodParser

describe('MethodParser', () => {

    let LambdaType

    beforeEach(() => {
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    test('bionicTag - no bionic tags', () => {
        const bionicTag = new MethodParser('@unknown tag').bionicTag
        expect(bionicTag).toBe(undefined)
    })

    const annotation = '@bionic static get set method (Float) => Int'

    test('name', () => {
        expect(new MethodParser(annotation).name).toBe('method')
    })

    test('kinds', () => {
        expect(new MethodParser(annotation).kinds).toStrictEqual(['get', 'set'])
    })

    test('static', () => {
        expect(new MethodParser(annotation).static).toBe(true)
    })

    test('async', () => {
        expect(new MethodParser(annotation).async).toBe(false)
    })

    test('type', () => {
        const type = new MethodParser(annotation).type
        expect(type).toBeInstanceOf(LambdaType)
        expect(type).toEqual({
            parameters: [{type: {typeName: 'Float'}}],
            returnType: {typeName: 'Int'},
            typeName: 'Lambda',
        })
    })

    test('signature', () => {
        const parser = new MethodParser(annotation)
        const lambdaType = new LambdaType()
        t.mockGetter(parser, 'type', () => lambdaType)

        expect(parser.signature).toBe(lambdaType)
    })

    test('signature, type is not a lambda', () => {
        const parser = new MethodParser(annotation)
        const notLambdaType = 'not a lambda'
        t.mockGetter(parser, 'name', () => 'methodName')
        t.mockGetter(parser, 'type', () => notLambdaType)

        expect(() => parser.signature).toThrow('Method named "methodName" has an annotations without a lambda type definition')
    })
})