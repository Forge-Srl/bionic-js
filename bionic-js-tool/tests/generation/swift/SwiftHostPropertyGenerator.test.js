const t = require('../../test-utils')

describe('SwiftHostPropertyGenerator', () => {

    let Class, Property, Parameter, AnyType, ArrayType, BoolType, DateType, FloatType, IntType, LambdaType,
        NativeObjectType, ObjectType, StringType, VoidType, WrappedObjectType, expectedHeader, expectedFooter

    function getCode(propertyType, isPropertyStatic = false, isPropertyOverriding = false, propertyKinds = ['get', 'set'],
                     propertyName = 'property1') {
        const class1 = new Class('Class1', '', [], [new Property(propertyName, 'property description', isPropertyStatic,
            isPropertyOverriding, propertyType, propertyKinds)], [], '', '')
        return class1.generator.swift.forHosting().getSource()
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
            'class Class1: BjsObject {',
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

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, false, ['get'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        get {',
            '            return Bjs.get.getInt(Bjs.get.getProperty(self.bjsClass, "property1"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only getter, reserved keyword', () => {
        const code = getCode(new IntType(), false, false, ['get'], 'default')

        t.expectCode(code,
            ...expectedHeader,
            '    var `default`:Int? {',
            '        get {',
            '            return Bjs.get.getInt(bjsGetProperty("default"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, false, ['set'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        set {',
            '            Bjs.get.setProperty(self.bjsClass, "property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, static, override', () => {
        const code = getCode(new IntType(), true, true)

        t.expectCode(code,
            ...expectedHeader,
            '    override class var property1:Int? {',
            '        get {',
            '            return Bjs.get.getInt(Bjs.get.getProperty(self.bjsClass, "property1"))',
            '        }',
            '        set {',
            '            Bjs.get.setProperty(self.bjsClass, "property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('AnyType', () => {
        const code = getCode(new AnyType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:BjsAnyObject {',
            '        get {',
            '            return Bjs.get.getAny(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", newValue.jsObj)',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('ArrayType', () => {
        const code = getCode(new ArrayType(new ArrayType(new IntType())))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:[[Int?]?]? {',
            '        get {',
            '            return Bjs.get.getArray(bjsGetProperty("property1"), {',
            '                return Bjs.get.getArray($0, {',
            '                    return Bjs.get.getInt($0)',
            '                })',
            '            })',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putArray(newValue, {',
            '                return Bjs.get.putArray($0, {',
            '                    return Bjs.get.putPrimitive($0)',
            '                })',
            '            }))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('BoolType', () => {
        const code = getCode(new BoolType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:Bool? {',
            '        get {',
            '            return Bjs.get.getBool(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('DateType', () => {
        const code = getCode(new DateType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:Date? {',
            '        get {',
            '            return Bjs.get.getDate(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('FloatType', () => {
        const code = getCode(new FloatType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:Double? {',
            '        get {',
            '            return Bjs.get.getFloat(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putPrimitive(newValue))',
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
            '    var property1:((_ voidLambda: (() -> Void)?) -> (() -> Void)?)? {',
            '        get {',
            '            let jsFunc_bjs0 = bjsGetProperty("property1")',
            '            return Bjs.get.getFunc(jsFunc_bjs0) {',
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
            '        set {',
            '            let nativeFunc_bjs0 = newValue',
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
            '            bjsSetProperty("property1", Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('NativeObjectType', () => {
        const code = getCode(new NativeObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:ClassName? {',
            '        get {',
            '            return Bjs.get.getNative(bjsGetProperty("property1"), ClassName.self)',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putNative(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('ObjectType', () => {
        const code = getCode(new ObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:ClassName? {',
            '        get {',
            '            return Bjs.get.getObj(bjsGetProperty("property1"), ClassName.bjsFactory)',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putObj(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('StringType', () => {
        const code = getCode(new StringType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:String? {',
            '        get {',
            '            return Bjs.get.getString(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('WrappedObjectType', () => {
        const code = getCode(new WrappedObjectType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:ClassName? {',
            '        get {',
            '            return Bjs.get.getWrapped(bjsGetProperty("property1"), ClassName.self)',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Bjs.get.putWrapped(newValue, ClassNameWrapper.self))',
            '        }',
            '    }',
            ...expectedFooter)
    })
})