const t = require('../../test-utils')

describe('SwiftHostConstructorGenerator', () => {

    let Class, Constructor, Parameter, VoidType, BoolType, IntType, ArrayType, LambdaType, expectedHeader,
        expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
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
            '        return "module/path"',
            '    }',
            '}']
    })

    function getCode(constructorParameters) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [], [], '', 'module/path')
        return class1.generator.swift.forHosting().getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    test('no params', () => {
        const code = getCode([])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init() {',
            '        self.init(Class1.bjsClass, [])',
            '    }',
            ...expectedFooter)
    })

    test('single primitive', () => {
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([intPar])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ intParam: Int?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putPrimitive(intParam)])',
            '    }',
            ...expectedFooter)
    })

    test('multiple primitives', () => {
        const boolPar = newParam(new BoolType(), 'boolParam')
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([boolPar, intPar])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ boolParam: Bool?, _ intParam: Int?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putPrimitive(boolParam), Bjs.get.putPrimitive(intParam)])',
            '    }',
            ...expectedFooter)
    })

    test('void lambda', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')

        const code = getCode([voidLambdaParam])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ voidNativeFunc: (() -> Void)?) {',
            '        let nativeFunc_bjs0 = voidNativeFunc',
            '        let jsFunc_bjs1: @convention(block) () -> Void = {',
            '            _ = nativeFunc_bjs0!()',
            '        }',
            '        self.init(Class1.bjsClass, [Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)])',
            '    }',
            ...expectedFooter)
    })

    test('void lambda, lambda returning primitive, primitive', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')
        const intLambdaParam = newParam(new LambdaType(new IntType(), []), 'intNativeFunc')
        const arrayLambdaParam = newParam(new LambdaType(new ArrayType(new IntType()), []), 'arrayNativeFunc')
        const intParam = newParam(new IntType(), 'intPar')

        const code = getCode([voidLambdaParam, intLambdaParam, arrayLambdaParam, intParam])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ voidNativeFunc: (() -> Void)?, _ intNativeFunc: (() -> Int?)?, _ arrayNativeFunc: (() -> [Int?]?)?, _ intPar: Int?) {',
            '        let nativeFunc_bjs0 = voidNativeFunc',
            '        let jsFunc_bjs1: @convention(block) () -> Void = {',
            '            _ = nativeFunc_bjs0!()',
            '        }',
            '        let nativeFunc_bjs2 = intNativeFunc',
            '        let jsFunc_bjs3: @convention(block) () -> JSValue = {',
            '            return Bjs.get.putPrimitive(nativeFunc_bjs2!())',
            '        }',
            '        let nativeFunc_bjs4 = arrayNativeFunc',
            '        let jsFunc_bjs5: @convention(block) () -> JSValue = {',
            '            return Bjs.get.putArray(nativeFunc_bjs4!(), {',
            '                return Bjs.get.putPrimitive($0)',
            '            })',
            '        }',
            '        self.init(Class1.bjsClass, [Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1), Bjs.get.putFunc(nativeFunc_bjs2, jsFunc_bjs3), Bjs.get.putFunc(nativeFunc_bjs4, jsFunc_bjs5), Bjs.get.putPrimitive(intPar)])',
            '    }',
            ...expectedFooter)
    })

    test('lambda returning lambda returning void lambda', () => {
        const chainLambda = new LambdaType(new LambdaType(new LambdaType(new VoidType(), []), []), [])
        const funcReturningFuncReturningVoidFunc = newParam(chainLambda, 'funcReturningFuncReturningVoidFunc')

        const code = getCode([funcReturningFuncReturningVoidFunc])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ funcReturningFuncReturningVoidFunc: (() -> (() -> (() -> Void)?)?)?) {',
            '        let nativeFunc_bjs0 = funcReturningFuncReturningVoidFunc',
            '        let jsFunc_bjs1: @convention(block) () -> JSValue = {',
            '            let nativeFunc_bjs2 = nativeFunc_bjs0!()',
            '            let jsFunc_bjs3: @convention(block) () -> JSValue = {',
            '                let nativeFunc_bjs4 = nativeFunc_bjs2!()',
            '                let jsFunc_bjs5: @convention(block) () -> Void = {',
            '                    _ = nativeFunc_bjs4!()',
            '                }',
            '                return Bjs.get.putFunc(nativeFunc_bjs4, jsFunc_bjs5)',
            '            }',
            '            return Bjs.get.putFunc(nativeFunc_bjs2, jsFunc_bjs3)',
            '        }',
            '        self.init(Class1.bjsClass, [Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)])',
            '    }',
            ...expectedFooter)
    })

    test('lambda taking lambda taking void lambda', () => {
        const voidFunc = newParam(new LambdaType(new VoidType(), []))
        const func2TakingVoidFunc = newParam(new LambdaType(new VoidType(), [voidFunc]), 'func2TakingVoidFunc')
        const func1TakingFunc2 = newParam(new LambdaType(new VoidType(), [func2TakingVoidFunc]), 'func1TakingFunc2')

        const code = getCode([func1TakingFunc2])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ func1TakingFunc2: ((_ func2TakingVoidFunc: (((() -> Void)?) -> Void)?) -> Void)?) {',
            '        let nativeFunc_bjs0 = func1TakingFunc2',
            '        let jsFunc_bjs1: @convention(block) (JSValue) -> Void = {',
            '            let jsFunc_bjs2 = $0',
            '            _ = nativeFunc_bjs0!(Bjs.get.getFunc(jsFunc_bjs2) {',
            '                let nativeFunc_bjs3 = $0',
            '                let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                    _ = nativeFunc_bjs3!()',
            '                }',
            '                _ = Bjs.get.funcCall(jsFunc_bjs2, Bjs.get.putFunc(nativeFunc_bjs3, jsFunc_bjs4))',
            '            })',
            '        }',
            '        self.init(Class1.bjsClass, [Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)])',
            '    }',
            ...expectedFooter)
    })

    test('array of lambdas taking and returning array of void lambdas', () => {
        const arrayOfVoidLambda = new ArrayType(new LambdaType(new VoidType(), []))
        const arrayOfVoidLambdaPar = newParam(arrayOfVoidLambda, 'arrayOfVoidLambdas')
        const lambda1 = new LambdaType(arrayOfVoidLambda, [arrayOfVoidLambdaPar])
        const arrayOfLambda1 = newParam(new ArrayType(lambda1), 'arrayOfLambda1')

        const code = getCode([arrayOfLambda1])

        t.expectCode(code,
            ...expectedHeader,
            '    convenience init(_ arrayOfLambda1: [((_ arrayOfVoidLambdas: [(() -> Void)?]?) -> [(() -> Void)?]?)?]?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putArray(arrayOfLambda1, {',
            '            let nativeFunc_bjs0 = $0',
            '            let jsFunc_bjs1: @convention(block) (JSValue) -> JSValue = {',
            '                return Bjs.get.putArray(nativeFunc_bjs0!(Bjs.get.getArray($0, {',
            '                    let jsFunc_bjs2 = $0',
            '                    return Bjs.get.getFunc(jsFunc_bjs2) {',
            '                        _ = Bjs.get.funcCall(jsFunc_bjs2)',
            '                    }',
            '                })), {',
            '                    let nativeFunc_bjs3 = $0',
            '                    let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                        _ = nativeFunc_bjs3!()',
            '                    }',
            '                    return Bjs.get.putFunc(nativeFunc_bjs3, jsFunc_bjs4)',
            '                })',
            '            }',
            '            return Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)',
            '        })])',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(constructorParameters) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [], [], '', 'module/path')
        return class1.generator.swift.forHosting().getScaffold()
    }

    test('no params, scaffold', () => {
        const code = getScaffold([])

        t.expectCode(code,
            'class Class1 {',
            '    ',
            '    init() {',
            '        ',
            '    }',
            '}')
    })

    test('single primitive, scaffold', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const code = getScaffold([intPar])

        t.expectCode(code,
            'class Class1 {',
            '    ',
            '    init(_ intParam: Int?) {',
            '        ',
            '    }',
            '}')
    })
})