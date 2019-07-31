const t = require('../../test-utils')

describe('SwiftWrapperPropertyGenerator', () => {

    let Class, Property, Parameter, AnyType, ArrayType, BoolType, DateType, FloatType, IntType, LambdaType,
        NativeObjectType, ObjectType, StringType, VoidType, WrappedObjectType, expectedHeader, expectedBindFunction

    function getCode(propertyType, isPropertyStatic = false, isPropertyOverriding = false, propertyKinds = ['get', 'set']) {
        const class1 = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            isPropertyOverriding, propertyType, propertyKinds)], [], '', 'module/path')
        return class1.generator.swift.forWrapping().getFiles()[0].content
    }

    function getFunctionsExportCode(instanceExports = [], staticExports = []) {
        return [
            '    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {',
            '        _ = nativeExports',
            ...staticExports.map(code => `            ${code}`),
            '            .exportBindFunction(bjsBind())',
            ...instanceExports.map(code => `            ${code}`),
            '    }',
            '    ']
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Property = t.requireModule('schema/Property').Property
        Parameter = t.requireModule('schema/Parameter').Parameter
        AnyType = t.requireModule('schema/types/AnyType').AnyType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        DateType = t.requireModule('schema/types/DateType').DateType
        FloatType = t.requireModule('schema/types/FloatType').FloatType
        IntType = t.requireModule('schema/types/IntType').IntType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
        NativeObjectType = t.requireModule('schema/types/NativeObjectType').NativeObjectType
        ObjectType = t.requireModule('schema/types/ObjectType').ObjectType
        StringType = t.requireModule('schema/types/StringType').StringType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        WrappedObjectType = t.requireModule('schema/types/WrappedObjectType').WrappedObjectType

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

        expectedBindFunction = [
            '    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.bindNative(Bjs.get.getBound($1, Class1.self) ?? Class1(), $0)',
            '        }',
            '    }']
    })

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, false, ['get'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode([], ['.exportFunction("bjsStaticGet_property1", bjsStaticGet_property1())']),
            '    class func bjsStaticGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            '    ',
            ...expectedBindFunction,
            '}')
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, false, ['set'])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode([], ['.exportFunction("bjsStaticSet_property1", bjsStaticSet_property1())']),
            '    class func bjsStaticSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            ...expectedBindFunction,
            '}')
    })

    test('IntType, static, override', () => {
        const code = getCode(new IntType(), true, true)

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode([], [
                '.exportFunction("bjsStaticGet_property1", bjsStaticGet_property1())',
                '.exportFunction("bjsStaticSet_property1", bjsStaticSet_property1())',
            ]),
            '    class func bjsStaticGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Class1.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsStaticSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Class1.property1 = Bjs.get.getInt($1)',
            '        }',
            '    }',
            '    ',
            ...expectedBindFunction,
            '}')
    })

    const getterAndSetterFunctionsExportCode = getFunctionsExportCode([
        '.exportFunction("bjsGet_property1", bjsGet_property1())',
        '.exportFunction("bjsSet_property1", bjsSet_property1())',
    ])

    test('AnyType', () => {
        const code = getCode(new AnyType())

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.getWrapped($0, Class1.self)!.property1.jsObj',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putArray(Bjs.get.getWrapped($0, Class1.self)!.property1, {',
            '                return Bjs.get.putArray($0, {',
            '                    return Bjs.get.putPrimitive($0)',
            '                })',
            '            })',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            let nativeFunc_bjs0 = Bjs.get.getWrapped($0, Class1.self)!.property1',
            '            let jsFunc_bjs1: @convention(block) (JSValue) -> JSValue = {',
            '                let jsFunc_bjs2 = $0',
            '                let nativeFunc_bjs3 = nativeFunc_bjs0!(Bjs.get.getFunc(jsFunc_bjs2) {',
            '                    _ = Bjs.get.funcCall(jsFunc_bjs2)',
            '                })',
            '                let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                    _ = nativeFunc_bjs3!()',
            '                }',
            '                return Bjs.get.putFunc(nativeFunc_bjs3, jsFunc_bjs4)',
            '            }',
            '            return Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            let jsFunc_bjs0 = $1',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getFunc(jsFunc_bjs0) {',
            '                let nativeFunc_bjs1 = $0',
            '                let jsFunc_bjs2: @convention(block) () -> Void = {',
            '                    _ = nativeFunc_bjs1!()',
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

    test('NativeObjectType', () => {
        const code = getCode(new NativeObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putNative(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getNative($1, ClassName.self)',
            '        }',
            '    }',
            '}')
    })

    test('ObjectType', () => {
        const code = getCode(new ObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putObj(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
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
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Class1.self)!.property1)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getString($1)',
            '        }',
            '    }',
            '}')
    })

    test('WrappedObjectType', () => {
        const code = getCode(new WrappedObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            ...getterAndSetterFunctionsExportCode,
            ...expectedBindFunction,
            '    ',
            '    class func bjsGet_property1() -> @convention(block) (JSValue) -> JSValue {',
            '        return {',
            '            return Bjs.get.putWrapped(Bjs.get.getWrapped($0, Class1.self)!.property1, ClassNameWrapper.self)',
            '        }',
            '    }',
            '    ',
            '    class func bjsSet_property1() -> @convention(block) (JSValue, JSValue) -> Void {',
            '        return {',
            '            Bjs.get.getWrapped($0, Class1.self)!.property1 = Bjs.get.getWrapped($1, ClassName.self)',
            '        }',
            '    }',
            '}')
    })
})