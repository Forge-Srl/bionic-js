const t = require('../../common')

describe('NativeObjectType', () => {

    let NativeObjectType

    beforeEach(() => {
        NativeObjectType = t.requireModule('schema/types/NativeObjectType')
    })

    test('typeName', () => {
        expect(NativeObjectType.typeName).toBe('NativeObject')
    })

    test('clone', () => {
        const nativeObject = new NativeObjectType('className')
        const nativeObjectClone = nativeObject.clone

        expect(nativeObject).not.toBe(nativeObjectClone)
        expect(nativeObject).toEqual(nativeObjectClone)
        expect(nativeObjectClone).toBeInstanceOf(NativeObjectType)
    })
})