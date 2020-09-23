const t = require('../../test-utils')

describe('SwiftHostClassGenerator', () => {

    let Class, BaseObjectClass, Constructor, Property, Method, IntType,
        expectedImports, expectedClassDeclaration, expectedFactoryMethod, expectedModulePathVar

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        BaseObjectClass = t.requireModule('schema/notable/BaseObjectClass').BaseObjectClass
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType

        expectedImports = [
            'import JavaScriptCore',
            'import Bjs',
            '']

        expectedClassDeclaration = [
            'class Class1: BjsObject {',
            '    ']

        expectedFactoryMethod = [
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ']

        expectedModulePathVar = [
            '    override class var bjsModulePath: String {',
            '        return "/module/path"',
            '    }']
    })

    function getCode(constructors, properties, methods, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, 'superModule/path')
            : new BaseObjectClass()
        const clazz = new Class('Class1', 'class description', constructors, properties, methods, superclass, 'module/path')
        return clazz.generator.forHosting().swift.getSource()
    }

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
        const code = getCode([], [], [], 'Superclass')

        t.expectCode(code,
            ...expectedImports,
            'class Class1: Superclass {',
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

    function getScaffold(constructors, properties, methods, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, 'superModule/path')
            : new BaseObjectClass()
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superclass, 'module/path')
        return class1.generator.forHosting().swift.getScaffold()
    }

    test('empty class without inheritance, scaffold', () => {
        const scaffold = getScaffold([], [], [])

        t.expectCode(scaffold,
            'import Bjs',
            '',
            'class Class1: BjsExport {',
            '    ',
            '}')
    })

    test('empty class with inheritance, scaffold', () => {
        const scaffold = getScaffold([], [], [], 'Superclass')

        t.expectCode(scaffold,
            'import Bjs',
            '',
            'class Class1: Superclass {',
            '    ',
            '}')
    })

    test('class parts order, scaffold', () => {
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
        const code = getScaffold(constructors, properties, methods)

        t.expectCode(code,
            'import Bjs',
            '',
            'class Class1: BjsExport {',
            '    ',
            '    class var staticProperty1:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '    ',
            '    class var staticProperty2:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '    ',
            '    class func staticMethod1() -> Int? {',
            '        ',
            '    }',
            '    ',
            '    class func staticMethod2() -> Int? {',
            '        ',
            '    }',
            '    ',
            '    init() {',
            '        ',
            '    }',
            '    ',
            '    var instanceProperty1:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '    ',
            '    var instanceProperty2:Int? {',
            '        get {',
            '            ',
            '        }',
            '        set {',
            '            ',
            '        }',
            '    }',
            '    ',
            '    func instanceMethod1() -> Int? {',
            '        ',
            '    }',
            '    ',
            '    func instanceMethod2() -> Int? {',
            '        ',
            '    }',
            '}')
    })
})