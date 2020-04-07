const t = require('../../test-utils')

describe('NativeObjectClass', () => {

    let NativeObjectClass, Class

    beforeEach(() => {
        NativeObjectClass = t.requireModule('schema/notable/NativeObjectClass').NativeObjectClass
        Class = t.requireModule('schema/Class').Class
    })

    const testCommonFields = nativeObjectClass => {
        expect(nativeObjectClass).toBeInstanceOf(NativeObjectClass)
        expect(nativeObjectClass).toBeInstanceOf(Class)
        expect(nativeObjectClass.name).toBe('BjsNativeObject')
        expect(nativeObjectClass.description).toBe('')
        expect(nativeObjectClass.constructors).toStrictEqual([])
        expect(nativeObjectClass.properties).toStrictEqual([])
        expect(nativeObjectClass.superclass).toBe(null)
    }

    test('constructor', () => {
        const nativeObjectClass = new NativeObjectClass()

        testCommonFields(nativeObjectClass)
        expect(nativeObjectClass.modulePath).toBe('BjsNativeObject')
    })

    test('isNativeObjectClass', () => {
        const guestFile = {rootDirPath: '', guestNativeDirPath: ''}
        const nativeObjectClass = new NativeObjectClass(guestFile)
        testCommonFields(nativeObjectClass)
        expect(nativeObjectClass.isNativeObjectClass).toBe(true)

        const clazz = new Class()
        expect(clazz.isNativeObjectClass).toBeFalsy()
    })
})