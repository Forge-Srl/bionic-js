const t = require('../../test-utils')

describe('SwiftHostMethodGenerator', () => {

    let Class, Method, Parameter, VoidType, BoolType, IntType, LambdaType, expectedHeader, expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType

        expectedHeader = [
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: BjsObject {',
            '    ']

        expectedFooter = [
            '    ',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    override class var bjsModulePath: String {',
            '        return "/module/path"',
            '    }',
            '}']
    })

    function getCode(isMethodStatic, methodReturnType, methodParameters, methodName = 'method1') {
        const class1 = new Class('Class1', '', [], [], [new Method(methodName, 'method description', isMethodStatic,
            methodReturnType, methodParameters)], null, false, 'module/path')
        return class1.generator.forHosting().swift.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    test('void return, no params', () => {
        const code = getCode(false, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1() {',
            '        _ = bjsCall("method1")',
            '    }',
            ...expectedFooter)
    })

    test('void return, reserved keyword', () => {
        const code = getCode(false, new VoidType(), [], 'default')

        t.expectCode(code,
            ...expectedHeader,
            '    func `default`() {',
            '        _ = bjsCall("default")',
            '    }',
            ...expectedFooter)
    })

    test('void return, no params, static', () => {
        const code = getCode(true, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    class func method1() {',
            '        _ = Bjs.get.call(self.bjsClass, "method1")',
            '    }',
            ...expectedFooter)
    })

    test('primitive return, primitive param', () => {
        const code = getCode(false, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1(_ boolParam: Bool?) -> Int? {',
            '        return Bjs.get.getInt(bjsCall("method1", Bjs.get.putPrimitive(boolParam)))',
            '    }',
            ...expectedFooter)
    })

    test('multiple primitive params', () => {
        const code = getCode(false, new VoidType(), [
            newParam(new BoolType(), 'boolParam'),
            newParam(new IntType(), 'intParam'),
        ])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1(_ boolParam: Bool?, _ intParam: Int?) {',
            '        _ = bjsCall("method1", Bjs.get.putPrimitive(boolParam), Bjs.get.putPrimitive(intParam))',
            '    }',
            ...expectedFooter)
    })

    test('void lambda return, void lambda param', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getCode(false, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1(_ voidLambda: (() -> Void)?) -> (() -> Void)? {',
            '        let nativeFunc_bjs0 = voidLambda',
            '        let jsFunc_bjs1: @convention(block) () -> Void = {',
            '            nativeFunc_bjs0!()',
            '        }',
            '        let jsFunc_bjs2 = bjsCall("method1", Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1))',
            '        return Bjs.get.getFunc(jsFunc_bjs2) {',
            '            _ = Bjs.get.funcCall(jsFunc_bjs2)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(isMethodStatic, methodReturnType, methodParameters, methodName = 'method1') {
        const class1 = new Class('Class1', '', [], [], [new Method(methodName, 'method description', isMethodStatic,
            methodReturnType, methodParameters)], null, false, 'module/path')
        return class1.generator.forHosting().swift.getScaffold()
    }

    const expectedScaffoldHeader = [
        'import Bjs',
        '']

    test('void return, no params, scaffold', () => {
        const code = getScaffold(false, new VoidType(), [])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    func method1() {',
            '        ',
            '    }',
            '}')
    })

    test('void return, no params, reserved keyword, scaffold', () => {
        const code = getScaffold(false, new VoidType(), [], 'throws')

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    func `throws`() {',
            '        ',
            '    }',
            '}')
    })

    test('void lambda return, void lambda param, static, scaffold', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getScaffold(true, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    class func method1(_ voidLambda: (() -> Void)?) -> (() -> Void)? {',
            '        ',
            '    }',
            '}')
    })
})