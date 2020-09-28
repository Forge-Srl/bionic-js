const t = require('../../test-utils')

describe('JsClassType', () => {

    let JsClassType

    beforeEach(() => {
        JsClassType = t.requireModule('schema/types/JsClassType').JsClassType
    })

    test('typeName', () => {
        expect(JsClassType.typeName).toBe('JsClass')
    })

    test('clone', () => {
        const jsClassType = new JsClassType('className')
        const jsClassTypeClone = jsClassType.clone

        expect(jsClassType).not.toBe(jsClassTypeClone)
        expect(jsClassType).toEqual(jsClassTypeClone)
        expect(jsClassTypeClone).toBeInstanceOf(JsClassType)
    })

    test('resolveClassType', () => {
        const jsClassType = new JsClassType('Class1')
        expect(jsClassType.resolveClassType(null)).toBe(jsClassType)
    })
})