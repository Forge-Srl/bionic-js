const t = require('../../test-utils')

describe('JsRefType', () => {

    let JsRefType

    beforeEach(() => {
        JsRefType = t.requireModule('schema/types/JsRefType').JsRefType
    })

    test('typeName', () => {
        expect(JsRefType.typeName).toBe('JsRef')
    })

    test('resolveClassType', () => {
        const jsRefType = new JsRefType('Class1')
        expect(jsRefType.resolveClassType(null)).toBe(jsRefType)
    })
})