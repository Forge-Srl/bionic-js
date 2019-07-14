const t = require('../../test-utils')

describe('SwiftWrapperClassGenerator', () => {

    let Class, Constructor, Property, Method, IntType,
        expectedImports, expectedClassDeclaration, expectedFunctionsExport

    function getCode(constructors, properties, methods, superClassName = '') {
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superClassName, 'module/path')
        return class1.generator.swift.forWrapping().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType

        expectedImports = [
            'import JavaScriptCore',
            'import Bjs',
            '']

        expectedClassDeclaration = [
            'class Class1Wrapper: BjsNativeWrapper {',
            '    ',
            '    override class var name: String { return "Class1" }',
            '    override class var wrapperPath: String { return "module/path" }',
            '    ',
        ]

        expectedFunctionsExport = [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports',
            '            .exportFunction("bjsStaticGet_staticProperty1", bjsStaticGet_staticProperty1())',
            '            .exportFunction("bjsStaticGet_staticProperty2", bjsStaticGet_staticProperty2())',
            '            .exportFunction("bjsStatic_staticMethod1", bjsStatic_staticMethod1())',
            '            .exportFunction("bjsStatic_staticMethod2", bjsStatic_staticMethod2())',
            '            .exportBindFunction(bjsBind())',
            '            .exportFunction("bjsGet_instanceProperty1", bjsGet_instanceProperty1())',
            '            .exportFunction("bjsGet_instanceProperty2", bjsGet_instanceProperty2())',
            '            .exportFunction("bjs_instanceMethod1", bjs_instanceMethod1())',
            '            .exportFunction("bjs_instanceMethod2", bjs_instanceMethod2())',
            '    }']
    })

    test('empty class without inheritance', () => {
        const code = getCode([], [], [])

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            ...expectedFunctionsExport,
            '}')
    })

    test('empty class with inheritance', () => {
        const code = getCode([], [], [], 'SuperClass')

        t.expectCode(code,
            ...expectedImports,
            ...expectedFunctionsExport,
            'class Class1: SuperClass {',
            '    ',
            '    override class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '}')
    })

    test('class parts order', () => {
        const intType = new IntType()

        const constructors = [new Constructor('desc', [])]
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
        const code = getCode(constructors, properties, methods)

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            ...expectedFunctionsExport,
            '',
            '')
    })
})