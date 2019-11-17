const t = require('../../test-utils')

describe('SwiftWrapperConstructorGenerator', () => {

    let Class, Constructor, Parameter, VoidType, BoolType, IntType, ArrayType, LambdaType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    function getCode(constructorParameters, superclass = null) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [], [], superclass, 'module/path')
        return class1.generator.swift.forWrapping().getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }


    const exportFunctionsCode = [
        '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
        '        return nativeExports',
        '    }',
        '    ',
    ]

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

    test('no params', () => {
        const code = getCode([])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }',
            '}')
    })

    test('no public constructor', () => {
        const code = new Class('Class1', '', [], [], [], null, 'module/path').generator.swift.forWrapping().getSource()

        t.expectCode(code,
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }',
            '}')
    })

    const publicConstructorWithIntParamBindCode = [
        '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
        '        _ = nativeExports.exportBindFunction({',
        '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getInt($1)), $0)',
        '        } as @convention(block) (JSValue, JSValue) -> Void)',
        '    }',
        '}',
    ]

    test('no public constructor, inherited public constructor', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const superclass = new Class('Superclass', '', [new Constructor('', [intPar])], [], [], null, 'module/superPath')
        const code = new Class('Class1', '', [], [], [], superclass, 'module/path').generator.swift.forWrapping().getSource()

        t.expectCode(code,
            ...getExpectedHeader('SuperclassWrapper'),
            ...exportFunctionsCode,
            ...publicConstructorWithIntParamBindCode)
    })

    test('no public constructor, inherited public constructor from superSuperclass', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const superSuperclass = new Class('SuperSuperclass', '', [new Constructor('', [intPar])], [], [], null, 'module/superSuperPath')
        const superclass = new Class('Superclass', '', [], [], [], superSuperclass, 'module/superPath')
        const code = new Class('Class1', '', [], [], [], superclass, 'module/path').generator.swift.forWrapping().getSource()

        t.expectCode(code,
            ...getExpectedHeader('SuperclassWrapper'),
            ...exportFunctionsCode,
            ...publicConstructorWithIntParamBindCode)
    })

    test('single primitive, no inherited public constructor', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const code = getCode([intPar])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            ...publicConstructorWithIntParamBindCode)
    })

    test('single primitive, inherited public constructor with different signature', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const boolPar = newParam(new BoolType(), 'boolParam')
        const superSuperclass = new Class('SuperSuperclass', '', [new Constructor('', [boolPar])], [], [], null, 'module/superPath')
        const superclass = new Class('Superclass', '', [new Constructor('constructor description', [boolPar, intPar])], [], [], superSuperclass, 'module/superPath')
        const code = getCode([intPar], superclass)

        t.expectCode(code,
            ...getExpectedHeader('SuperclassWrapper'),
            ...exportFunctionsCode,
            ...publicConstructorWithIntParamBindCode)
    })

    test('multiple primitives', () => {
        const boolPar = newParam(new BoolType(), 'boolParam')
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([boolPar, intPar])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getBool($1), Bjs.get.getInt($2)), $0)',
            '        } as @convention(block) (JSValue, JSValue, JSValue) -> Void)',
            '    }',
            '}')
    })

    test('void lambda', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')

        const code = getCode([voidLambdaParam])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            let jsFunc_bjs0 = $1',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(Bjs.get.getFunc(jsFunc_bjs0) {',
            '                _ = Bjs.get.funcCall(jsFunc_bjs0)',
            '            }), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
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
            ...getExpectedHeader(),
            ...exportFunctionsCode,
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
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
            '        } as @convention(block) (JSValue, JSValue, JSValue, JSValue, JSValue) -> Void)',
            '    }',
            '}')
    })
})