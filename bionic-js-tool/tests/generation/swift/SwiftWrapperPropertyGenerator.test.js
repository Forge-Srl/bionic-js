const t = require('../../test-utils')

describe('SwiftWrapperPropertyGenerator', () => {

    let Class, Property, Parameter, JsClassType, JsRefType, ArrayType, BoolType, DateType, FloatType,
        IntType, LambdaType, StringType, VoidType, NativeClassType

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
    })

    function getCode(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set']) {
        const class1 = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, true, 'module/path')
        return class1.generator.forWrapping(undefined, 'Project1').swift.getSource()
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
            '            bjs.bindNative(bjs.getBound($1, Class1.self), $0)',
            '        } as @convention(block) (JSValue, JSValue) -> Void)',
            '    }']
    }

    const expectedHeader = [
        'import JavaScriptCore',
        'import Bjs',
        '',
        'class Class1BjsWrapper: BjsNativeWrapper {',
        '    ',
    ]

    const expectedFooter = [
        '    ',
        '    private static var _bjsLocator: BjsLocator = BjsLocator("Project1", "Class1")',
        '    override class var bjsLocator: BjsLocator { _bjsLocator }',
        '}']

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, ['get'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStaticGet_property1", bjsStaticGet_property1())']),
            '    ',
            '    private class func bjsStaticGet_property1() -> @convention(block) () -> JSValue {',
            '        return {',
            '            return bjs.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStaticSet_property1", bjsStaticSet_property1())']),
            '    ',
            '    private class func bjsStaticSet_property1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = bjs.getInt($0)',
            '        }',
            '    }',
            ...expectedFooter)
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
            '            return bjs.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsStaticSet_property1() -> @convention(block) (JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = bjs.getInt($0)',
            '        }',
            '    }',
            ...expectedFooter)
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
            '            return bjs.getWrapped($0, Class1.self)!.property1.jsObj',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getAny($1)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('ArrayType', () => {
        const code = getCode(new ArrayType(new ArrayType(new IntType())))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putArray(bjs.getWrapped($0, Class1.self)!.property1, {',
            '                return bjs.putArray($0, {',
            '                    return bjs.putPrimitive($0)',
            '                })',
            '            })',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getArray($1, {',
            '                return bjs.getArray($0, {',
            '                    return bjs.getInt($0)',
            '                })',
            '            })',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('BoolType', () => {
        const code = getCode(new BoolType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putPrimitive(bjs.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getBool($1)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('DateType', () => {
        const code = getCode(new DateType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putPrimitive(bjs.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getDate($1)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('FloatType', () => {
        const code = getCode(new FloatType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putPrimitive(bjs.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getFloat($1)',
            '        }',
            '    }',
            ...expectedFooter)
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
            '            let nativeFunc_bjs0 = bjs.getWrapped($0, Class1.self)!.property1',
            '            let jsFunc_bjs1: @convention(block) (JSValue) -> JSValue = {',
            '                let jsFunc_bjs2 = $0',
            '                let nativeFunc_bjs3 = nativeFunc_bjs0!(bjs.getFunc(jsFunc_bjs2) {',
            '                    _ = bjs.funcCall(jsFunc_bjs2)',
            '                })',
            '                let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs3!()',
            '                }',
            '                return bjs.putFunc(nativeFunc_bjs3, jsFunc_bjs4)',
            '            }',
            '            return bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getFunc(jsFunc_bjs0) {',
            '                let nativeFunc_bjs1 = $0',
            '                let jsFunc_bjs2: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs1!()',
            '                }',
            '                let jsFunc_bjs3 = bjs.funcCall(jsFunc_bjs0, bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2))',
            '                return bjs.getFunc(jsFunc_bjs3) {',
            '                    _ = bjs.funcCall(jsFunc_bjs3)',
            '                }',
            '            }',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('JsClassType', () => {
        const code = getCode(new JsClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putObj(bjs.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getObj($1, ClassName.bjsFactory)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('StringType', () => {
        const code = getCode(new StringType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putPrimitive(bjs.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getString($1)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('NativeClassType', () => {
        const code = getCode(new NativeClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            '    ',
            '    private class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return bjs.putWrapped(bjs.getWrapped($0, Class1.self)!.property1, ClassNameBjsWrapper.self)',
            '        }',
            '    }',
            '    ',
            '    private class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            bjs.getWrapped($0, Class1.self)!.property1 = bjs.getWrapped($1, ClassName.self)',
            '        }',
            '    }',
            ...expectedFooter)
    })
})