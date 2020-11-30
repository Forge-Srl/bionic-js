const t = require('../../test-utils')

describe('NativeRefType', () => {

    let NativeRefType

    beforeEach(() => {
        NativeRefType = t.requireModule('schema/types/NativeRefType').NativeRefType
    })

    test('typeName', () => {
        expect(NativeRefType.typeName).toBe('NativeRef')
    })

    test('clone', () => {
        const nativeRefType = new NativeRefType('className')
        const nativeRefTypeClone = nativeRefType.clone

        expect(nativeRefType).not.toBe(nativeRefTypeClone)
        expect(nativeRefType).toEqual(nativeRefTypeClone)
        expect(nativeRefTypeClone).toBeInstanceOf(NativeRefType)
    })

    test('resolveClassType', () => {
        const nativeRefType = new NativeRefType('Class1')
        expect(nativeRefType.resolveClassType(null)).toBe(nativeRefType)
    })
})