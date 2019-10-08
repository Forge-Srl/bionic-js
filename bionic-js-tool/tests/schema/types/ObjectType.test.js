const t = require('../../test-utils')

describe('ObjectType', () => {

    let Validation, ObjectType, NativeObjectType, WrappedObjectType

    beforeEach(() => {
        Validation = t.mockAndRequireModule('schema/Validation').Validation
        ObjectType = t.requireModule('schema/types/ObjectType').ObjectType
        NativeObjectType = t.requireModule('schema/types/NativeObjectType').NativeObjectType
        WrappedObjectType = t.requireModule('schema/types/WrappedObjectType').WrappedObjectType
    })

    test('typeName', () => {
        expect(ObjectType.typeName).toBe('Object')
    })

    test('clone', () => {
        const classObj = new ObjectType('className')
        const classObjClone = classObj.clone

        expect(classObj).not.toBe(classObjClone)
        expect(classObj).toEqual(classObjClone)
    })

    test('constructor', () => {
        const arrayType = new ObjectType('class...')
        expect(arrayType.typeName).toBe('Object')
        expect(arrayType.className).toBe('class...')
    })

    test('is valid', () => {
        let classType = new ObjectType('ClassName')

        const result = 'result'
        Validation.validateIdentifier.mockReturnValueOnce(result)

        expect(classType.isValid).toBe(result)
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })

    test('toString', () => {
        let classType = new ObjectType('class...')
        expect(classType.toString()).toBe('class...')
    })

    const jsClasses = new Set(['Class1'])
    const nativeClasses = new Set(['NativeClass1'])

    test('resolveNativeType, jsClass type', () => {
        const jsClassType = new ObjectType('Class1')
        expect(jsClassType.resolveNativeType(jsClasses, nativeClasses)).toStrictEqual(jsClassType)
    })

    test('resolveNativeType, nativeClass type', () => {
        const nativeClassType = new ObjectType('NativeClass1')
        const expectedType = new WrappedObjectType('NativeClass1')

        expect(nativeClassType.resolveNativeType(jsClasses, nativeClasses)).toStrictEqual(expectedType)
    })

    test('resolveNativeType, unknownClass type', () => {
        const unknownClassType = new ObjectType('UnknownClass')
        const expectedType = new NativeObjectType('UnknownClass')

        expect(unknownClassType.resolveNativeType(jsClasses, nativeClasses)).toStrictEqual(expectedType)
    })
})