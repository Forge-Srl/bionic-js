const t = require('../../test-utils')

describe('JavascriptWrapperClassGenerator', () => {

    let Class, NativeObjectClass, Parameter, Constructor, Property, Method, IntType, nativeObjectSchema,
        getExpectedHeader, expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        NativeObjectClass = t.requireModule('schema/notable/NativeObjectClass').NativeObjectClass
        Parameter = t.requireModule('schema/Parameter').Parameter
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType

        const expectedJavascriptCode = require('./expectedJavascriptCode')
        nativeObjectSchema = expectedJavascriptCode.getNativeObjectSchema()
        getExpectedHeader = expectedJavascriptCode.getExpectedHeader
        expectedFooter = expectedJavascriptCode.getExpectedFooter()
    })

    function getCode(properties, methods, superclass = nativeObjectSchema) {
        const class1 = new Class('Class1', 'class description', [], properties, methods,
            superclass, 'native/module/path')
        return class1.generator.forWrapping().javascript.getSource()
    }

    test('empty class with no inheritance', () => t.expectCode(getCode([], []),
        ...getExpectedHeader(undefined, '../../BjsNativeObject', false),
        ...expectedFooter))

    test('empty class with inheritance', () => {
        const superclass = new Class('Superclass', 'superclass desc', [
            new Constructor('desc', [new Parameter(new IntType(), 'par1', 'desc1')]),
        ], [], [], nativeObjectSchema, 'native/superclass/path')

        t.expectCode(getCode([], [], superclass),
            ...getExpectedHeader('Superclass', '../superclass/path', false),
            ...expectedFooter)
    })

    test('class parts order', () => {
        const intType = new IntType()

        const properties = [
            new Property('instanceProperty1', 'desc', false, false, intType, ['get', 'set']),
            new Property('staticProperty1', 'desc', true, false, intType, ['get', 'set']),
            new Property('instanceProperty2', 'desc', false, false, intType, ['get', 'set']),
            new Property('staticProperty2', 'desc', true, false, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('instanceMethod1', 'desc', false, false, intType, []),
            new Method('staticMethod1', 'desc', true, false, intType, []),
            new Method('instanceMethod2', 'desc', false, false, intType, []),
            new Method('staticMethod2', 'desc', true, false, intType, []),
        ]
        const code = getCode(properties, methods)

        t.expectCode(code,
            ...getExpectedHeader(undefined, '../../BjsNativeObject'),
            '    static get staticProperty1() {',
            '        return bjsNative.bjsStaticGet_staticProperty1()',
            '    }',
            '    ',
            '    static set staticProperty1(value) {',
            '        bjsNative.bjsStaticSet_staticProperty1(value)',
            '    }',
            '    ',
            '    static get staticProperty2() {',
            '        return bjsNative.bjsStaticGet_staticProperty2()',
            '    }',
            '    ',
            '    static set staticProperty2(value) {',
            '        bjsNative.bjsStaticSet_staticProperty2(value)',
            '    }',
            '    ',
            '    static staticMethod1() {',
            '        return bjsNative.bjsStatic_staticMethod1()',
            '    }',
            '    ',
            '    static staticMethod2() {',
            '        return bjsNative.bjsStatic_staticMethod2()',
            '    }',
            '    ',
            '    get instanceProperty1() {',
            '        return bjsNative.bjsGet_instanceProperty1(this)',
            '    }',
            '    ',
            '    set instanceProperty1(value) {',
            '        bjsNative.bjsSet_instanceProperty1(this, value)',
            '    }',
            '    ',
            '    get instanceProperty2() {',
            '        return bjsNative.bjsGet_instanceProperty2(this)',
            '    }',
            '    ',
            '    set instanceProperty2(value) {',
            '        bjsNative.bjsSet_instanceProperty2(this, value)',
            '    }',
            '    ',
            '    instanceMethod1() {',
            '        return bjsNative.bjs_instanceMethod1(this)',
            '    }',
            '    ',
            '    instanceMethod2() {',
            '        return bjsNative.bjs_instanceMethod2(this)',
            '    }',
            ...expectedFooter)
    })
})