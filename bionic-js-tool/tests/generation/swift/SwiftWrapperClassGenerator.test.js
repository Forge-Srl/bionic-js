const t = require('../../test-utils')

describe('SwiftWrapperClassGenerator', () => {

    let Class, Parameter, Constructor, Property, Method, IntType

    function getCode(properties, methods, superclass = null, withScaffold = false) {
        const class1 = new Class('Class1', 'class description', [new Constructor('desc', [])], properties, methods,
            superclass, true, 'module/path')
        const hostClassGeneratorForScaffolding = withScaffold ? class1.generator.forHosting().swift : undefined
        return class1.generator.forWrapping(hostClassGeneratorForScaffolding).swift.getSource()
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Parameter = t.requireModule('schema/Parameter').Parameter
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType
    })

    const getExpectedHeader = (superclassName = 'BjsNativeWrapper') => [
        'import JavaScriptCore',
        'import Bjs',
        '',
        `class Class1Wrapper: ${superclassName} {`,
        '    ',
        '    override class var name: String { return "Class1" }',
        '    override class var wrapperPath: String { return "/module/path" }',
        '    ',
    ]


    const emptyClassExportFunctions = [
        '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
        '        return nativeExports',
        '    }']

    const emptyClassExportFunctionsWithInheritance = [
        '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
        '        return super.bjsExportFunctions(nativeExports)',
        '    }']

    const emptyClassBindFunction = [
        '    ',
        '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
        '        _ = nativeExports.exportBindFunction({',
        '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
        '        } as @convention(block) (JSValue, JSValue) -> Void)',
        '    }',
        '}']

    test('empty class without inheritance', () => t.expectCode(getCode([], []),
        ...getExpectedHeader(),
        ...emptyClassExportFunctions,
        ...emptyClassBindFunction))

    test('empty class with inheritance', () => t.expectCode(getCode([], [], new Class('Superclass')),
        ...getExpectedHeader('SuperclassWrapper'),
        ...emptyClassExportFunctionsWithInheritance,
        ...emptyClassBindFunction))

    test('class parts order', () => {
        const intType = new IntType()

        const properties = [
            new Property('instanceProperty1', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty1', 'desc', true, intType, ['get', 'set']),
            new Property('instanceProperty2', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty2', 'desc', true, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('instanceMethod1', 'desc', false, intType, []),
            new Method('staticMethod1', 'desc', true, intType, []),
            new Method('instanceMethod2', 'desc', false, intType, []),
            new Method('staticMethod2', 'desc', true, intType, []),
        ]
        const code = getCode(properties, methods)

        t.expectCode(code,
            ...getExpectedHeader(),
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
            '        return nativeExports',
            '            .exportFunction("bjsStaticGet_staticProperty1", bjsStaticGet_staticProperty1())',
            '            .exportFunction("bjsStaticSet_staticProperty1", bjsStaticSet_staticProperty1())',
            '            .exportFunction("bjsStaticGet_staticProperty2", bjsStaticGet_staticProperty2())',
            '            .exportFunction("bjsStaticSet_staticProperty2", bjsStaticSet_staticProperty2())',
            '            .exportFunction("bjsStatic_staticMethod1", bjsStatic_staticMethod1())',
            '            .exportFunction("bjsStatic_staticMethod2", bjsStatic_staticMethod2())',
            '            .exportFunction("bjsGet_instanceProperty1", bjsGet_instanceProperty1())',
            '            .exportFunction("bjsSet_instanceProperty1", bjsSet_instanceProperty1())',
            '            .exportFunction("bjsGet_instanceProperty2", bjsGet_instanceProperty2())',
            '            .exportFunction("bjsSet_instanceProperty2", bjsSet_instanceProperty2())',
            '            .exportFunction("bjs_instanceMethod1", bjs_instanceMethod1())',
            '            .exportFunction("bjs_instanceMethod2", bjs_instanceMethod2())',
            '    }',
            '    ',
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }',
            '    ',
            '    private class func bjsStaticGet_staticProperty1() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticProperty1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStaticSet_staticProperty1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.staticProperty1 = Bjs.get.getInt($0)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStaticGet_staticProperty2() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticProperty2)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStaticSet_staticProperty2() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.staticProperty2 = Bjs.get.getInt($0)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStatic_staticMethod1() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticMethod1())',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStatic_staticMethod2() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticMethod2())',
            '        }',
            '    }',
            '    ',
            '    private class func bjsGet_instanceProperty1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceProperty1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_instanceProperty1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.instanceProperty1 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsGet_instanceProperty2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceProperty2)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_instanceProperty2() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.instanceProperty2 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjs_instanceMethod1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceMethod1())',
            '        }',
            '    }',
            '    ',
            '    private class func bjs_instanceMethod2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceMethod2())',
            '        }',
            '    }',
            '}')
    })

    test('class parts order, withScaffold', () => {
        const intType = new IntType()

        const properties = [
            new Property('property', 'desc', false, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('method', 'desc', false, intType, []),
        ]

        const superclassConstructor = new Constructor('desc', [new Parameter(new IntType(), 'param1')])
        const superclass = new Class('SuperClass', `SuperClass description`, [superclassConstructor], [], [], null,
            true, 'module/superclassPath')
        const code = getCode(properties, methods, superclass, true)

        t.expectCode(code,
            ...getExpectedHeader('SuperClassWrapper'),
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
            '        return super.bjsExportFunctions(nativeExports)',
            '            .exportFunction("bjsGet_property", bjsGet_property())',
            '            .exportFunction("bjsSet_property", bjsSet_property())',
            '            .exportFunction("bjs_method", bjs_method())',
            '    }',
            '    ',
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }',
            '    ',
            '    private class func bjsGet_property() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjs_method() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.method())',
            '        }',
            '    }',
            '}',
            '',
            '/* Class1 class scaffold:',
            '',
            'import Bjs',
            '',
            'class Class1: SuperClass {',
            '    ',
            '    init() {',
            '        ',
            '    }',
            '    ',
            '    var property:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '    ',
            '    func method() -> Int? {',
            '        ',
            '    }',
            '}',
            '',
            '*/')
    })
})