const t = require('../../test-utils')

describe('ClassType', () => {

    let Validation, ClassType, JsClassType, NativeClassType

    beforeEach(() => {
        Validation = t.mockAndRequireModule('schema/Validation').Validation
        ClassType = t.requireModule('schema/types/ClassType').ClassType
        JsClassType = t.requireModule('schema/types/JsClassType').JsClassType
        NativeClassType = t.requireModule('schema/types/NativeClassType').NativeClassType
    })

    test('typeName', () => {
        expect(ClassType.typeName).toBe('Class')
    })

    test('constructor', () => {
        const arrayType = new ClassType('class...')
        expect(arrayType.typeName).toBe('Class')
        expect(arrayType.className).toBe('class...')
    })

    test('is valid', () => {
        let classType = new ClassType('ClassName')

        const result = 'result'
        Validation.validateIdentifier.mockReturnValueOnce(result)

        expect(classType.isValid).toBe(result)
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })

    test('toString', () => {
        let classType = new ClassType('class...')
        expect(classType.toString()).toBe('class...')
    })

    const nativeClassesMap = new Map([['JsClass1', false], ['NativeClass1', true]])

    test('resolveClassType, jsClass type', () => {
        const classType = new ClassType('JsClass1')
        const jsClassType = new JsClassType('JsClass1')
        expect(classType.resolveClassType(nativeClassesMap)).toStrictEqual(jsClassType)
    })

    test('resolveClassType, nativeClass type', () => {
        const classType = new ClassType('NativeClass1')
        const expectedType = new NativeClassType('NativeClass1')
        expect(classType.resolveClassType(nativeClassesMap)).toStrictEqual(expectedType)
    })

    test('resolveClassType, UnknownClass', () => {
        const classType = new ClassType('UnknownClass')
        expect(() => classType.resolveClassType(nativeClassesMap)).toThrowError('Class UnknownClass is not defined')
    })
})