const t = require('../../test-utils')

describe('NativeClassType', () => {

    let NativeClassType

    beforeEach(() => {
        NativeClassType = t.requireModule('schema/types/NativeClassType').NativeClassType
    })

    test('typeName', () => {
        expect(NativeClassType.typeName).toBe('NativeClass')
    })

    test('clone', () => {
        const nativeClassType = new NativeClassType('className')
        const nativeClassTypeClone = nativeClassType.clone

        expect(nativeClassType).not.toBe(nativeClassTypeClone)
        expect(nativeClassType).toEqual(nativeClassTypeClone)
        expect(nativeClassTypeClone).toBeInstanceOf(NativeClassType)
    })

    test('resolveClassType', () => {
        const nativeClassType = new NativeClassType('Class1')
        expect(nativeClassType.resolveClassType(null)).toBe(nativeClassType)
    })
})