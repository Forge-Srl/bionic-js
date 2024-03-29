const t = require('../../test-utils')

describe('MethodAnnotationExplorer', () => {

    let LambdaType, MethodAnnotationExplorer

    beforeEach(() => {
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
        MethodAnnotationExplorer = t.requireModule('parser/jsExplorer/MethodAnnotationExplorer').MethodAnnotationExplorer
    })

    test('bionicTag', () => {
        const bionicTag = new MethodAnnotationExplorer('@bionic').bionicTag
        expect(bionicTag).toEqual({})
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

    test('isStatic', () => {
        expect(new MethodAnnotationExplorer(annotation).isStatic).toBe(true)
    })

    test('isGenerator', () => {
        expect(new MethodAnnotationExplorer().isGenerator).toBe(false)
    })

    test('isAsync', () => {
        expect(new MethodAnnotationExplorer(annotation).isAsync).toBe(false)
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

    test('type of a method without parameter names', () => {
        expect(() => new MethodAnnotationExplorer('@bionic method name (Int) => Void').type)
            .toThrow('parameters of method "name" must have names')
    })
})