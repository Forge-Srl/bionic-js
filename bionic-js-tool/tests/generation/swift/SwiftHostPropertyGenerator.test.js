const t = require('../../test-utils')

describe('SwiftHostPropertyGenerator', () => {

    let Class, Property, Parameter, JsClassType, JsRefType, ArrayType, BoolType, DateType, FloatType,
        IntType, LambdaType, StringType, VoidType, NativeClassType, expectedHeader, expectedFooter

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

        expectedHeader = [
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: BjsObject {',
            '    ']

        expectedFooter = [
            '    ',
            '    private static var _bjsLocator: BjsLocator = BjsLocator("Project1", "Class1")',
            '    override class var bjsLocator: BjsLocator { _bjsLocator }',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 { Class1(jsObject) }',
            '}']
    })

    function getCode(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set'],
                     propertyName = 'property1') {
        const class1 = new Class('Class1', '', [], [new Property(propertyName, 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, false, '')
        return class1.generator.forHosting('Project1').swift.getSource()
    }

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, ['get'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        get {',
            '            return bjs.getInt(bjs.getProperty(self.bjsClass, "property1"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only getter, reserved keyword', () => {
        const code = getCode(new IntType(), false, ['get'], 'default')

        t.expectCode(code,
            ...expectedHeader,
            '    var `default`:Int? {',
            '        get {',
            '            return Class1.bjs.getInt(bjsGetProperty("default"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        set {',
            '            bjs.setProperty(self.bjsClass, "property1", bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, static', () => {
        const code = getCode(new IntType(), true)

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        get {',
            '            return bjs.getInt(bjs.getProperty(self.bjsClass, "property1"))',
            '        }',
            '        set {',
            '            bjs.setProperty(self.bjsClass, "property1", bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('JsRefType', () => {
        const code = getCode(new JsRefType())

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:BjsAnyObject {',
            '        get {',
            '            return Class1.bjs.getAny(bjsGetProperty("property1"))',
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
            '            return Class1.bjs.getArray(bjsGetProperty("property1"), {',
            '                return Class1.bjs.getArray($0, {',
            '                    return Class1.bjs.getInt($0)',
            '                })',
            '            })',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putArray(newValue, {',
            '                return Class1.bjs.putArray($0, {',
            '                    return Class1.bjs.putPrimitive($0)',
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
            '            return Class1.bjs.getBool(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putPrimitive(newValue))',
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
            '            return Class1.bjs.getDate(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putPrimitive(newValue))',
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
            '            return Class1.bjs.getFloat(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putPrimitive(newValue))',
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
            '            return Class1.bjs.getFunc(jsFunc_bjs0) {',
            '                let nativeFunc_bjs1 = $0',
            '                let jsFunc_bjs2: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs1!()',
            '                }',
            '                let jsFunc_bjs3 = Class1.bjs.funcCall(jsFunc_bjs0, Class1.bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2))',
            '                return Class1.bjs.getFunc(jsFunc_bjs3) {',
            '                    _ = Class1.bjs.funcCall(jsFunc_bjs3)',
            '                }',
            '            }',
            '        }',
            '        set {',
            '            let nativeFunc_bjs0 = newValue',
            '            let jsFunc_bjs1: @convention(block) (JSValue) -> JSValue = {',
            '                let jsFunc_bjs2 = $0',
            '                let nativeFunc_bjs3 = nativeFunc_bjs0!(Class1.bjs.getFunc(jsFunc_bjs2) {',
            '                    _ = Class1.bjs.funcCall(jsFunc_bjs2)',
            '                })',
            '                let jsFunc_bjs4: @convention(block) () -> Void = {',
            '                    nativeFunc_bjs3!()',
            '                }',
            '                return Class1.bjs.putFunc(nativeFunc_bjs3, jsFunc_bjs4)',
            '            }',
            '            bjsSetProperty("property1", Class1.bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('JsClassType', () => {
        const code = getCode(new JsClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:ClassName? {',
            '        get {',
            '            return Class1.bjs.getObj(bjsGetProperty("property1"), ClassName.bjsFactory)',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putObj(newValue))',
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
            '            return Class1.bjs.getString(bjsGetProperty("property1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('NativeClassType', () => {
        const code = getCode(new NativeClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader,
            '    var property1:ClassName? {',
            '        get {',
            '            return Class1.bjs.getWrapped(bjsGetProperty("property1"), ClassName.self)',
            '        }',
            '        set {',
            '            bjsSetProperty("property1", Class1.bjs.putWrapped(newValue, ClassNameBjsWrapper.self))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only getter, reserved keyword', () => {
        const code = getCode(new IntType(), false, ['get'], 'default')

        t.expectCode(code,
            ...expectedHeader,
            '    var `default`:Int? {',
            '        get {',
            '            return Class1.bjs.getInt(bjsGetProperty("default"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set'],
                         propertyName = 'property1') {
        const class1 = new Class('Class1', '', [], [new Property(propertyName, 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, false, '')
        return class1.generator.forHosting().swift.getScaffold()
    }

    const expectedScaffoldHeader = [
        'import Bjs',
        '']

    test('IntType, scaffold, only setter, static', () => {
        const code = getScaffold(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    class var property1:Int? {',
            '        set {',
            '            ',
            '        }',
            '    }',
            '}')
    })

    test('IntType, scaffold, only getter', () => {
        const code = getScaffold(new IntType(), false, ['get'])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    var property1:Int? {',
            '        get {',
            '            ',
            '        }',
            '    }',
            '}')
    })

    test('LambdaType, scaffold, reserved keyword, only setter', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const voidLambdaParam = new Parameter(voidLambda, 'voidLambda')
        const code = getScaffold(new LambdaType(voidLambda, [voidLambdaParam]), false, ['set'], 'return')

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    var `return`:((_ voidLambda: (() -> Void)?) -> (() -> Void)?)? {',
            '        set {',
            '            ',
            '        }',
            '    }',
            '}')
    })

    test('IntType, scaffold, getter and setter', () => {
        const code = getScaffold(new IntType(), false)

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'class Class1: BjsExport {',
            '    ',
            '    var property1:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '}')
    })
})