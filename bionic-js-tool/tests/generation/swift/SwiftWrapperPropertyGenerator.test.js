const t = require('../../test-utils')

describe('SwiftWrapperPropertyGenerator', () => {

    let Class, Property, Parameter, JsClassType, JsRefType, ArrayType, BoolType, DateType, FloatType,
        IntType, LambdaType, NativeRefType, StringType, VoidType, NativeClassType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Property = t.requireModule('schema/Property').Property
        Parameter = t.requireModule('schema/Parameter').Parameter
        JsClassType = t.requireModule('schema/types/JsClassType').JsClassType
        JsRefType = t.requireModule('schema/types/JsRefType').JsRefType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        DateType = t.requireModule('schema/types/DateType').DateType
        FloatType = t.requireModule('schema/types/FloatType').FloatType
        IntType = t.requireModule('schema/types/IntType').IntType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
        StringType = t.requireModule('schema/types/StringType').StringType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        NativeClassType = t.requireModule('schema/types/NativeClassType').NativeClassType
        NativeRefType = t.requireModule('schema/types/NativeRefType').NativeRefType
    })

    function getCode(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set']) {
        const class1 = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, true, 'module/path')
        return class1.generator.forWrapping().swift.getSource()
    }

    function getFunctionsExportCode(functionsExports = []) {
        return [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {',
            '        return nativeExports',
            ...functionsExports.map(code => `            ${code}`),
            '    }',
            '    ',
            '    override class func bjsBind(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports.exportBindFunction({',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }']
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

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, ['get'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStaticGet_property1", bjsStaticGet_property1())']),
            '    ',
            '    private class func bjsStaticGet_property1() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            '}')
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStaticSet_property1", bjsStaticSet_property1())']),
            '    ',
            '    private class func bjsStaticSet_property1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = Bjs.get.getInt($0)',
            '        }',
            '    }',
            '}')
    })

    test('IntType, static', () => {
        const code = getCode(new IntType(), true)

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode([
                '.exportFunction("bjsStaticGet_property1", bjsStaticGet_property1())',
                '.exportFunction("bjsStaticSet_property1", bjsStaticSet_property1())',
            ]),
            '    ',
            '    private class func bjsStaticGet_property1() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStaticSet_property1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = Bjs.get.getInt($0)',
            '        }',
            '    }',
            '}')
    })

    const getterAndSetterFunctionsExportCode = getFunctionsExportCode([
        '.exportFunction("bjsGet_property1", bjsGet_property1())',
        '.exportFunction("bjsSet_property1", bjsSet_property1())',
    ])

    test('JsRefType', () => {
        const code = getCode(new JsRefType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.getWrapped($0, Class1.self)!.property1.jsObj',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getAny($1)',
            '        }',
            '    }',
            '}')
    })

    test('ArrayType', () => {
        const code = getCode(new ArrayType(new ArrayType(new IntType())))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putArray(Bjs.get.getWrapped($0, Class1.self)!.property1, {',
            '                return Bjs.get.putArray($0, {',
            '                    return Bjs.get.putPrimitive($0)',
            '                })',
            '            })',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getArray($1, {',
            '                return Bjs.get.getArray($0, {',
            '                    return Bjs.get.getInt($0)',
            '                })',
            '            })',
            '        }',
            '    }',
            '}')
    })

    test('BoolType', () => {
        const code = getCode(new BoolType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getBool($1)',
            '        }',
            '    }',
            '}')
    })

    test('DateType', () => {
        const code = getCode(new DateType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getDate($1)',
            '        }',
            '    }',
            '}')
    })

    test('FloatType', () => {
        const code = getCode(new FloatType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getFloat($1)',
            '        }',
            '    }',
            '}')
    })

    test('LambdaType', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const voidLambdaParam = new Parameter(voidLambda, 'voidLambda', 'void lambda description')
        const code = getCode(new LambdaType(voidLambda, [voidLambdaParam]))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            let nativeFunc_bjs0 = Bjs.get.getWrapped($0, Class1.self)!.property1',
            '            let jsFunc_bjs1: @convention(block) (JSValue) -> JSValue = {',
            '                let jsFunc_bjs2 = $0',
            '                let nativeFunc_bjs3 = nativeFunc_bjs0!(Bjs.get.getFunc(jsFunc_bjs2) {',
            '                    _ = Bjs.get.funcCall(jsFunc_bjs2)',
            '                })',
            '                let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs3!()',
            '                }',
            '                return Bjs.get.putFunc(nativeFunc_bjs3, jsFunc_bjs4)',
            '            }',
            '            return Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getFunc(jsFunc_bjs0) {',
            '                let nativeFunc_bjs1 = $0',
            '                let jsFunc_bjs2: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs1!()',
            '                }',
            '                let jsFunc_bjs3 = Bjs.get.funcCall(jsFunc_bjs0, Bjs.get.putFunc(nativeFunc_bjs1, jsFunc_bjs2))',
            '                return Bjs.get.getFunc(jsFunc_bjs3) {',
            '                    _ = Bjs.get.funcCall(jsFunc_bjs3)',
            '                }',
            '            }',
            '        }',
            '    }',
            '}')
    })

    test('NativeRefType', () => {
        const code = getCode(new NativeRefType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putNative(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getNative($1, ClassName.self)',
            '        }',
            '    }',
            '}')
    })

    test('JsClassType', () => {
        const code = getCode(new JsClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putObj(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getObj($1, ClassName.bjsFactory)',
            '        }',
            '    }',
            '}')
    })

    test('StringType', () => {
        const code = getCode(new StringType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getString($1)',
            '        }',
            '    }',
            '}')
    })

    test('NativeClassType', () => {
        const code = getCode(new NativeClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putWrapped(Bjs.get.getWrapped($0, Class1.self)!.property1, ClassNameWrapper.self)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getWrapped($1, ClassName.self)',
            '        }',
            '    }',
            '}')
    })
})