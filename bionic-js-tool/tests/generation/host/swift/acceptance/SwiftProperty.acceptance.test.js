const t = require('../../../../test-utils')

describe('Swift property acceptance', () => {

    let Class, Property, AnyType, ArrayType, BoolType, DateType, FloatType, IntType, LambdaType, NativeObjectType,
        ObjectType, StringType, VoidType, WrappedObjectType, expectedHeader, expectedFooter

    function getCode(isPropertyStatic, isPropertyOverriding, propertyType, propertyKinds) {
        const class1 = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            isPropertyOverriding, propertyType, propertyKinds)], [], '', '')
        return class1.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Property = t.requireModule('schema/Property')
        AnyType = t.requireModule('schema/types/AnyType')
        ArrayType = t.requireModule('schema/types/ArrayType')
        BoolType = t.requireModule('schema/types/BoolType')
        DateType = t.requireModule('schema/types/DateType')
        FloatType = t.requireModule('schema/types/FloatType')
        IntType = t.requireModule('schema/types/IntType')
        LambdaType = t.requireModule('schema/types/LambdaType')
        NativeObjectType = t.requireModule('schema/types/NativeObjectType')
        ObjectType = t.requireModule('schema/types/ObjectType')
        StringType = t.requireModule('schema/types/StringType')
        VoidType = t.requireModule('schema/types/VoidType')
        WrappedObjectType = t.requireModule('schema/types/WrappedObjectType')

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

    test('only getter, static, primitive', () => {
        const code = getCode(true, false, new IntType(), ['get'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        get {',
            '            return Bjs.get.getInt(Bjs.get.getProperty(self.bjsClass, "property1"))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('only setter, static, primitive', () => {
        const code = getCode(true, false, new IntType(), ['set'])

        t.expectCode(code,
            ...expectedHeader,
            '    class var property1:Int? {',
            '        set {',
            '            Bjs.get.setProperty(self.bjsClass, "property1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            ...expectedFooter)
    })

    test('static, override, primitive', () => {
        const code = getCode(true, true, new IntType(), ['get', 'set'])

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
})