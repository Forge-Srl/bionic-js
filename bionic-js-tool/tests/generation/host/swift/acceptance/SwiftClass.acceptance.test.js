const t = require('../../../../test-utils')

describe('Swift class', () => {

    let Class, Constructor, Property, Method, IntType,
        expectedImports, expectedClassDeclaration, expectedFactoryMethod, expectedModulePathVar

    function getCode(constructors, properties, methods, superClassName = '') {
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superClassName, 'module/path')
        return class1.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Constructor = t.requireModule('schema/Constructor')
        Property = t.requireModule('schema/Property')
        Method = t.requireModule('schema/Method')
        IntType = t.requireModule('schema/types/IntType')

        expectedImports = [
            'import JavaScriptCore',
            'import Bjs',
            '']

        expectedClassDeclaration = [
            'class Class1: BjsClass {',
            '    ']

        expectedFactoryMethod = [
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ']

        expectedModulePathVar = [
            '    override class var bjsModulePath: String {',
            '        return "module/path"',
            '    }']
    })

    test('empty class without inheritance', () => {
        const code = getCode([], [], [])

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            ...expectedFactoryMethod,
            ...expectedModulePathVar,
            '}')
    })

    test('empty class with inheritance', () => {
        const code = getCode([], [], [], 'SuperClass')

        t.expectCode(code,
            ...expectedImports,
            'class Class1: SuperClass {',
            '    ',
            '    override class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            ...expectedModulePathVar,
            '}')
    })

    test('class parts order', () => {
        const intType = new IntType()

        const constructors = [new Constructor('desc', [])]
        const properties = [
            new Property('instanceProperty1', 'desc', false, false, intType, ['get', 'set']),
            new Property('staticProperty1', 'desc', true, false, intType, ['get', 'set']),
            new Property('instanceProperty2', 'desc', false, false, intType, ['get', 'set']),
            new Property('staticProperty2', 'desc', true, false, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('instanceMethod1', 'desc', false, false, intType, []),
            new Method('staticMethod1', 'desc', true, false, intType, []),
            new Method('instanceMethod2', 'desc', false, false, intType, []),
            new Method('staticMethod2', 'desc', true, false, intType, []),
        ]
        const code = getCode(constructors, properties, methods)

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            '    class var staticProperty1:Int? {',
            '        get {',
            '            return Bjs.get.getInt(Bjs.get.getProperty(self.bjsClass, "staticProperty1"))',
            '        }',
            '        set {',
            '            Bjs.get.setProperty(self.bjsClass, "staticProperty1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    class var staticProperty2:Int? {',
            '        get {',
            '            return Bjs.get.getInt(Bjs.get.getProperty(self.bjsClass, "staticProperty2"))',
            '        }',
            '        set {',
            '            Bjs.get.setProperty(self.bjsClass, "staticProperty2", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    class func staticMethod1() -> Int? {',
            '        return Bjs.get.getInt(Bjs.get.call(self.bjsClass, "staticMethod1"))',
            '    }',
            '    ',
            '    class func staticMethod2() -> Int? {',
            '        return Bjs.get.getInt(Bjs.get.call(self.bjsClass, "staticMethod2"))',
            '    }',
            '    ',
            '    convenience init() {',
            '        self.init(Class1.bjsClass, [])',
            '    }',
            '    ',
            '    var instanceProperty1:Int? {',
            '        get {',
            '            return Bjs.get.getInt(bjsGetProperty("instanceProperty1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("instanceProperty1", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    var instanceProperty2:Int? {',
            '        get {',
            '            return Bjs.get.getInt(bjsGetProperty("instanceProperty2"))',
            '        }',
            '        set {',
            '            bjsSetProperty("instanceProperty2", Bjs.get.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    func instanceMethod1() -> Int? {',
            '        return Bjs.get.getInt(bjsCall("instanceMethod1"))',
            '    }',
            '    ',
            '    func instanceMethod2() -> Int? {',
            '        return Bjs.get.getInt(bjsCall("instanceMethod2"))',
            '    }',
            '    ',
            ...expectedFactoryMethod,
            ...expectedModulePathVar,
            '}')
    })
})