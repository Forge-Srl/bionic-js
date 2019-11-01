const t = require('../../test-utils')

describe('SwiftWrapperConstructorGenerator', () => {

    let Class, Constructor, Parameter, VoidType, BoolType, IntType, ArrayType, LambdaType, expectedHeader,
        functionsExportCode

    function getCode(constructorParameters) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [], [], '', 'module/path')
        return class1.generator.swift.forWrapping().getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

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
            'class Class1Wrapper: BjsNativeWrapper {',
            '    ',
            '    override class var name: String { return "Class1" }',
            '    override class var wrapperPath: String { return "/module/path" }',
            '    ',
        ]

        functionsExportCode = [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports',
            '            .exportBindFunction(bjsBind())',
            '    }',
            '    ',
        ]
    })

    test('no params', () => {
        const code = getCode([])

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        }',
            '    }',
            '}')
    })

    test('no default constructor', () => {
        const code = new Class('Class1', '', [], [], [], '', 'module/path').generator.swift.forWrapping().getSource()

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self), $0)',
            '        }',
            '    }',
            '}')
    })

    test('single primitive', () => {
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([intPar])

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getInt($1)), $0)',
            '        }',
            '    }',
            '}')
    })

    test('multiple primitives', () => {
        const boolPar = newParam(new BoolType(), 'boolParam')
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([boolPar, intPar])

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getBool($1), Bjs.get.getInt($2)), $0)',
            '        }',
            '    }',
            '}')
    })

    test('void lambda', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')

        const code = getCode([voidLambdaParam])

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getFunc(jsFunc_bjs0) {',
            '                _ = Bjs.get.funcCall(jsFunc_bjs0)',
            '            }), $0)',
            '        }',
            '    }',
            '}')
    })

    test('void lambda, lambda returning primitive, primitive', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')
        const intLambdaParam = newParam(new LambdaType(new IntType(), []), 'intNativeFunc')
        const arrayLambdaParam = newParam(new LambdaType(new ArrayType(new IntType()), []), 'arrayNativeFunc')
        const intParam = newParam(new IntType(), 'intPar')

        const code = getCode([voidLambdaParam, intLambdaParam, arrayLambdaParam, intParam])

        t.expectCode(code,
            ...expectedHeader,
            ...functionsExportCode,
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue, JSValue, JSValue, JSValue) -> Void {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            let jsFunc_bjs1 = $2',
            '            let jsFunc_bjs2 = $3',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getFunc(jsFunc_bjs0) {',
            '                _ = Bjs.get.funcCall(jsFunc_bjs0)',
            '            }, Bjs.get.getFunc(jsFunc_bjs1) {',
            '                return Bjs.get.getInt(Bjs.get.funcCall(jsFunc_bjs1))',
            '            }, Bjs.get.getFunc(jsFunc_bjs2) {',
            '                return Bjs.get.getArray(Bjs.get.funcCall(jsFunc_bjs2), {',
            '                    return Bjs.get.getInt($0)',
            '                })',
            '            }, Bjs.get.getInt($4)), $0)',
            '        }',
            '    }',
            '}')
    })
})