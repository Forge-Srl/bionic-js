const t = require('../../test-utils')

describe('JavascriptWrapperPropertyGenerator', () => {

    let Class, Property, IntType, expectedHeader, expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Property = t.requireModule('schema/Property').Property
        IntType = t.requireModule('schema/types/IntType').IntType

        const expectedJavascriptCode = require('./expectedJavascriptCode')
        expectedHeader = expectedJavascriptCode.getExpectedHeader()
        expectedFooter = expectedJavascriptCode.getExpectedFooter()
    })

    function expectPropertyCode(isPropertyStatic, propertyKinds, expectedCode) {
        const schema = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            new IntType(), propertyKinds)], [], null, true, 'native/path')
        const code = schema.generator.forWrapping().javascript.getSource()
        t.expectCode(code, ...expectedCode)
    }

    test('Only getter, static', () => {
        expectPropertyCode(true, ['get'], [
            ...expectedHeader,
            '    static get property1() {',
            '        return bjsNative.bjsStaticGet_property1()',
            '    }',
            ...expectedFooter])
    })

    test('Only setter, static', () => {
        expectPropertyCode(true, ['set'], [
            ...expectedHeader,
            '    static set property1(value) {',
            '        bjsNative.bjsStaticSet_property1(value)',
            '    }',
            ...expectedFooter])
    })

    test('Getter and setter', () => {
        expectPropertyCode(false, ['get', 'set'], [
            ...expectedHeader,
            '    get property1() {',
            '        return bjsNative.bjsGet_property1(this)',
            '    }',
            '    ',
            '    set property1(value) {',
            '        bjsNative.bjsSet_property1(this, value)',
            '    }',
            ...expectedFooter])
    })
})