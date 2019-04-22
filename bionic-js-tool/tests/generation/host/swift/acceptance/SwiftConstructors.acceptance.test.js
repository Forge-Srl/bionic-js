const t = require('../../../../test-utils')

describe('Swift constructors acceptance', () => {

    let Class, Constructor, Parameter, VoidType, IntType, ArrayType, LambdaType, expectedHeader, expectedFooter

    function getClassCode(classObj) {
        return classObj.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Constructor = t.requireModule('schema/Constructor')
        Parameter = t.requireModule('schema/Parameter')
        VoidType = t.requireModule('schema/types/VoidType')
        IntType = t.requireModule('schema/types/IntType')
        ArrayType = t.requireModule('schema/types/ArrayType')
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

    test('no params', () => {
        const class1 = new Class('Class1', '', [new Constructor('', [])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init() {',
            '        self.init(Class1.bjsClass, [])',
            '    }',
            ...expectedFooter)
    })

    test('primitive parameter', () => {
        const primitivePar = new Parameter(new IntType(), 'parameter', '')
        const class1 = new Class('Class1', '', [new Constructor('', [primitivePar])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init(_ parameter: Int?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putPrimitive(parameter)])',
            '    }',
            ...expectedFooter)
    })

    test('void lambda parameter', () => {
        const voidLambdaParam = new Parameter(new LambdaType(new VoidType(), []), 'voidNativeFunc', '')
        const class1 = new Class('Class1', '', [new Constructor('', [voidLambdaParam])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
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

    test('multiple lambda parameters', () => {
        const voidLambdaParam = new Parameter(new LambdaType(new VoidType(), []), 'voidNativeFunc', '')
        const intLambdaParam = new Parameter(new LambdaType(new IntType(), []), 'intNativeFunc', '')
        const arrayLambdaParam = new Parameter(new LambdaType(new ArrayType(new IntType()), []), 'arrayNativeFunc', '')
        const intParam = new Parameter(new IntType(), 'intPar', '')

        const class1 = new Class('Class1', '', [new Constructor('', [voidLambdaParam, intLambdaParam, arrayLambdaParam, intParam])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
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

    test('"lambda returning lambda returning lambda" parameter', () => {
        const chainLambda = new LambdaType(new LambdaType(new LambdaType(new VoidType(), []), []), [])
        const funcReturningFuncReturningVoidFunc = new Parameter(chainLambda, 'funcReturningFuncReturningVoidFunc', '')
        const class1 = new Class('Class1', '', [new Constructor('', [funcReturningFuncReturningVoidFunc])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
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

    test('"lambda taking lambda taking void lambda" parameter', () => {
        const voidFunc = new Parameter(new LambdaType(new VoidType(), []), 'voidFunc', '')
        const func2TakingVoidFunc = new Parameter(new LambdaType(new VoidType(), [voidFunc]), 'func2TakingVoidFunc', '')
        const func1TakingFunc2 = new Parameter(new LambdaType(new VoidType(), [func2TakingVoidFunc]), 'func1TakingFunc2', '')
        const class1 = new Class('Class1', '', [new Constructor('', [func1TakingFunc2])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init(_ func1TakingFunc2: ((_ func2TakingVoidFunc: ((_ voidFunc: (() -> Void)?) -> Void)?) -> Void)?) {',
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

    test('array of lambdas taking and returning array of void lambda', () => {
        const arrayOfVoidLambda = new ArrayType(new LambdaType(new VoidType(), []))
        const arrayOfVoidLambdaPar = new Parameter(arrayOfVoidLambda, 'arrayOfVoidLambdas', '')
        const lambda1 = new LambdaType(arrayOfVoidLambda, [arrayOfVoidLambdaPar])
        const arrayOfLambda1 = new Parameter(new ArrayType(lambda1), 'arrayOfLambda1', '')
        const class1 = new Class('Class1', '', [new Constructor('', [arrayOfLambda1])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
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
})