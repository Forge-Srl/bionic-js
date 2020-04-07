const t = require('../../test-utils')

describe('SwiftWrapperMethodGenerator', () => {

    let Class, NativeObjectClass, Method, Parameter, VoidType, BoolType, IntType, LambdaType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        NativeObjectClass = t.requireModule('schema/notable/NativeObjectClass').NativeObjectClass
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    function getCode(isMethodStatic, isMethodOverriding, methodReturnType, methodParameters) {
        const class1 = new Class('Class1', '', [], [], [new Method('method1', 'method description', isMethodStatic,
            isMethodOverriding, methodReturnType, methodParameters)], new NativeObjectClass(), 'module/path')
        return class1.generator.forWrapping().swift.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    const expectedHeader = [
        'import JavaScriptCore',
        'import Bjs',
        '',
        'class Class1Wrapper: BjsNativeWrapper {',
        '    ',
        '    override class var name: String { return "Class1" }',
        '    override class var wrapperPath: String { return "/module/path" }',
        '    ',
    ]

    function getFunctionsExportCode(functionExports = []) {
        return [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
            '        return nativeExports',
            ...functionExports.map(code => `            ${code}`),
            '    }',
            '    ',
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }']
    }

    function testMethodWithVoidReturnAndNoParams(overriding) {
        const code = getCode(false, overriding, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", bjs_method1())']),
            '    ',
            '    private class func bjs_method1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            _ = Bjs.get.getWrapped($0, Class1.self)!.method1()',
            '        }',
            '    }',
            '}')
    }

    test('void return, no params', () => {
        testMethodWithVoidReturnAndNoParams(false)
    })

    test('void return, no params, overriding', () => {
        testMethodWithVoidReturnAndNoParams(true)
    })

    function testStaticMethodWithVoidReturnAndNoParams(overriding) {
        const code = getCode(true, overriding, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStatic_method1", bjsStatic_method1())']),
            '    ',
            '    private class func bjsStatic_method1() -> @convention(block) () -> Void {',
            '        return {',
            '            _ = Class1.method1()',
            '        }',
            '    }',
            '}')
    }

    test('void return, no params, static', () => {
        testStaticMethodWithVoidReturnAndNoParams(false)
    })

    test('void return, no params, static, overriding', () => {
        testStaticMethodWithVoidReturnAndNoParams(true)
    })

    test('void return, primitive param, static', () => {
        const code = getCode(true, false, new VoidType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStatic_method1", bjsStatic_method1())']),
            '    ',
            '    private class func bjsStatic_method1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            _ = Class1.method1(Bjs.get.getBool($0))',
            '        }',
            '    }',
            '}')
    })

    test('primitive return, primitive param', () => {
        const code = getCode(false, false, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", bjs_method1())']),
            '    ',
            '    private class func bjs_method1() -> @convention(block) (JSValue, JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.method1(Bjs.get.getBool($1)))',
            '        }',
            '    }',
            '}')
    })

    test('multiple primitive params', () => {
        const code = getCode(false, false, new VoidType(), [
            newParam(new BoolType(), 'boolParam'),
            newParam(new IntType(), 'intParam'),
        ])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", bjs_method1())']),
            '    ',
            '    private class func bjs_method1() -> @convention(block) (JSValue, JSValue, JSValue) -> Void {',
            '        return {',
            '            _ = Bjs.get.getWrapped($0, Class1.self)!.method1(Bjs.get.getBool($1), Bjs.get.getInt($2))',
            '        }',
            '    }',
            '}')
    })

    test('void lambda return, void lambda param', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getCode(false, false, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", bjs_method1())']),
            '    ',
            '    private class func bjs_method1() -> @convention(block) (JSValue, JSValue) -> JSValue {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            let nativeFunc_bjs1 = Bjs.get.getWrapped($0, Class1.self)!.method1(Bjs.get.getFunc(jsFunc_bjs0) {',
            '                _ = Bjs.get.funcCall(jsFunc_bjs0)',
            '            })',
            '            let jsFunc_bjs2: @convention(block) () -> Void = {',
            '                _ = nativeFunc_bjs1!()',
            '            }',
            '            return Bjs.get.putFunc(nativeFunc_bjs1, jsFunc_bjs2)',
            '        }',
            '    }',
            '}')
    })
})