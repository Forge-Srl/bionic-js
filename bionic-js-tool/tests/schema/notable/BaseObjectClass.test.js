const t = require('../../test-utils')

describe('BaseObjectClass', () => {

    let BaseObjectClass, Class

    beforeEach(() => {
        BaseObjectClass = t.requireModule('schema/notable/BaseObjectClass').BaseObjectClass
        Class = t.requireModule('schema/Class').Class
    })

    test('constructor', () => {
        const baseObjectClass = new BaseObjectClass()
        expect(baseObjectClass).toBeInstanceOf(BaseObjectClass)
        expect(baseObjectClass).toBeInstanceOf(Class)
        expect(baseObjectClass.name).toBe('BjsBaseObject')
        expect(baseObjectClass.description).toBe('')
        expect(baseObjectClass.constructors).toStrictEqual([])
        expect(baseObjectClass.properties).toStrictEqual([])
        expect(baseObjectClass.superclass).toBe(null)
        expect(baseObjectClass.modulePath).toBe(null)
    })

    test('isBaseObjectClass', () => {
        const baseObjectClass = new BaseObjectClass()
        expect(baseObjectClass.isBaseObjectClass).toBe(true)

        const clazz = new Class()
        expect(clazz.isBaseObjectClass).toBeFalsy()
    })
})