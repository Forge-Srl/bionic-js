const t = require('../../../../test-utils')

describe('Swift method acceptance', () => {

    let Class, Method, Parameter, VoidType, BoolType, IntType, LambdaType, expectedHeader, expectedFooter

    function getCode(isMethodStatic, isMethodOverriding, methodReturnType, methodParameters) {
        const class1 = new Class('Class1', '', [new Method('method1', 'method description', isMethodStatic,
            isMethodOverriding, methodReturnType, methodParameters)], [], [], '', '')
        return class1.getSwiftGenerator().getFiles()[0].content
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Method = t.requireModule('schema/Method')
        Parameter = t.requireModule('schema/Parameter')
        BoolType = t.requireModule('schema/types/BoolType')
        IntType = t.requireModule('schema/types/IntType')
        VoidType = t.requireModule('schema/types/VoidType')
        LambdaType = t.requireModule('schema/types/LambdaType')

        expectedHeader = [
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: BjsClass {',
            '    ']

        expectedFooter = [
            '    ',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    override class var bjsModulePath: String {',
            '        return ""',
            '    }',
            '}']
    })

    test('void return, no params', () => {
        const code = getCode(false, false, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1() {',
            '        _ = bjsCall("method1")',
            '    }',
            ...expectedFooter)
    })

    test('void return, no params, static', () => {
        const code = getCode(true, false, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    class func method1() {',
            '        _ = Bjs.get.call(self.bjsClass, "method1")',
            '    }',
            ...expectedFooter)
    })

    test('void return, no params, overriding', () => {
        const code = getCode(false, true, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    override func method1() {',
            '        _ = bjsCall("method1")',
            '    }',
            ...expectedFooter)
    })

    test('void return, no params, static, overriding', () => {
        const code = getCode(true, true, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    override class func method1() {',
            '        _ = Bjs.get.call(self.bjsClass, "method1")',
            '    }',
            ...expectedFooter)
    })

    test('primitive return, primitive param', () => {
        const code = getCode(false, false, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1(_ boolParam: Bool?) -> Int? {',
            '        return Bjs.get.getInt(bjsCall("method1", Bjs.get.putPrimitive(boolParam)))',
            '    }',
            ...expectedFooter)
    })

    test('multiple primitive params', () => {
        const code = getCode(false, false, new VoidType(), [
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
        const code = getCode(false, false, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedHeader,
            '    func method1(_ voidLambda: (() -> Void)?) -> (() -> Void)? {',
            '        let nativeFunc_bjs0 = voidLambda',
            '        let jsFunc_bjs1: @convention(block) () -> Void = {',
            '            _ = nativeFunc_bjs0!()',
            '        }',
            '        let jsFunc_bjs2 = bjsCall("method1", Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1))',
            '        return Bjs.get.getFunc(jsFunc_bjs2) {',
            '            _ = Bjs.get.funcCall(jsFunc_bjs2)',
            '        }',
            '    }',
            ...expectedFooter)
    })
})