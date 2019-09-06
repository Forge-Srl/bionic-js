const t = require('../../test-utils')

describe('SwiftWrapperClassGenerator', () => {

    let Class, Constructor, Property, Method, IntType, expectedHeader

    function getCode(constructors, properties, methods, superclassName = '') {
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superclassName, 'module/path')
        return class1.generator.swift.forWrapping().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType

        expectedHeader = [
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1Wrapper: BjsNativeWrapper {',
            '    ',
            '    override class var name: String { return "Class1" }',
            '    override class var wrapperPath: String { return "module/path" }',
            '    ',
        ]
    })

    function expectEmptyClass(code) {
        t.expectCode(code,
            ...expectedHeader,
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports',
            '            .exportBindFunction(bjsBind())',
            '    }',
            '    ',
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        }',
            '    }',
            '}')
    }

    test('empty class without inheritance', () => expectEmptyClass(getCode([], [], [])))

    test('empty class with inheritance', () => expectEmptyClass(getCode([], [], [], 'Superclass')))

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

        const expectedFunctionsExport = [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports',
            '            .exportFunction("bjsStaticGet_staticProperty1", bjsStaticGet_staticProperty1())',
            '            .exportFunction("bjsStaticSet_staticProperty1", bjsStaticSet_staticProperty1())',
            '            .exportFunction("bjsStaticGet_staticProperty2", bjsStaticGet_staticProperty2())',
            '            .exportFunction("bjsStaticSet_staticProperty2", bjsStaticSet_staticProperty2())',
            '            .exportFunction("bjsStatic_staticMethod1", bjsStatic_staticMethod1())',
            '            .exportFunction("bjsStatic_staticMethod2", bjsStatic_staticMethod2())',
            '            .exportBindFunction(bjsBind())',
            '            .exportFunction("bjsGet_instanceProperty1", bjsGet_instanceProperty1())',
            '            .exportFunction("bjsSet_instanceProperty1", bjsSet_instanceProperty1())',
            '            .exportFunction("bjsGet_instanceProperty2", bjsGet_instanceProperty2())',
            '            .exportFunction("bjsSet_instanceProperty2", bjsSet_instanceProperty2())',
            '            .exportFunction("bjs_instanceMethod1", bjs_instanceMethod1())',
            '            .exportFunction("bjs_instanceMethod2", bjs_instanceMethod2())',
            '    }']

        t.expectCode(code,
            ...expectedHeader,
            ...expectedFunctionsExport,
            '    ',
            '    class func bjsStaticGet_staticProperty1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticProperty1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsStaticSet_staticProperty1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Class1.staticProperty1 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsStaticGet_staticProperty2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticProperty2)',
            '        }',
            '    }',
            '    ',
            '    class func bjsStaticSet_staticProperty2() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Class1.staticProperty2 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsStatic_staticMethod1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticMethod1())',
            '        }',
            '    }',
            '    ',
            '    class func bjsStatic_staticMethod2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.staticMethod2())',
            '        }',
            '    }',
            '    ',
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        }',
            '    }',
            '    ',
            '    class func bjsGet_instanceProperty1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceProperty1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_instanceProperty1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.instanceProperty1 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsGet_instanceProperty2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceProperty2)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_instanceProperty2() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.instanceProperty2 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            '    class func bjs_instanceMethod1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceMethod1())',
            '        }',
            '    }',
            '    ',
            '    class func bjs_instanceMethod2() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.instanceMethod2())',
            '        }',
            '    }',
            '}')
    })
})