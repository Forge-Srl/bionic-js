const t = require('../../test-utils')

describe('JsRefType', () => {

    let JsRefType

    beforeEach(() => {
        JsRefType = t.requireModule('schema/types/JsRefType').JsRefType
    })

    test('typeName', () => {
        expect(JsRefType.typeName).toBe('JsRef')
    })

    test('clone', () => {
        const jsRefType = new JsRefType()
        const jsRefTypeClone = jsRefType.clone

        expect(jsRefType).not.toBe(jsRefTypeClone)
        expect(jsRefType).toEqual(jsRefTypeClone)
        expect(jsRefTypeClone).toBeInstanceOf(JsRefType)
    })

    test('resolveClassType', () => {
        const jsRefType = new JsRefType('Class1')
        expect(jsRefType.resolveClassType(null)).toBe(jsRefType)
    })
})