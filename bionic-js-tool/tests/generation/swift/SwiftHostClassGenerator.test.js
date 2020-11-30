const t = require('../../test-utils')

describe('SwiftHostClassGenerator', () => {

    let Class, Constructor, Property, Method, IntType,
        expectedImports, expectedClassDeclaration, expectedFactoryMethod, expectedModulePathVar

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
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
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 { Class1(jsObject) }',
        ]

        expectedModulePathVar = [
            '    private static var _bjsLocator: BjsLocator = BjsLocator("Project1", "Class1")',
            '    override class var bjsLocator: BjsLocator { _bjsLocator }',
        ]
    })

    function getCode(constructors, properties, methods, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, false, 'superModule/path')
            : null
        const clazz = new Class('Class1', 'class description', constructors, properties, methods, superclass, false, 'module/path')
        return clazz.generator.forHosting('Project1').swift.getSource()
    }

    test('empty class without inheritance', () => {
        const code = getCode([], [], [])

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            ...expectedModulePathVar,
            ...expectedFactoryMethod,
            '}')
    })

    test('empty class with inheritance', () => {
        const code = getCode([], [], [], 'Superclass')

        t.expectCode(code,
            ...expectedImports,
            'class Class1: Superclass {',
            '    ',
            ...expectedModulePathVar,
            '    override class func bjsFactory(_ jsObject: JSValue) -> Class1 { Class1(jsObject) }',
            '}')
    })

    test('class parts order', () => {
        const intType = new IntType()

        const constructors = [new Constructor('desc', [])]
        const properties = [
            new Property('instanceProperty1', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty1', 'desc', true, intType, ['get', 'set']),
            new Property('instanceProperty2', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty2', 'desc', true, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('instanceMethod1', 'desc', false, intType, []),
            new Method('staticMethod1', 'desc', true, intType, []),
            new Method('instanceMethod2', 'desc', false, intType, []),
            new Method('staticMethod2', 'desc', true, intType, []),
        ]
        const code = getCode(constructors, properties, methods)

        t.expectCode(code,
            ...expectedImports,
            ...expectedClassDeclaration,
            '    class var staticProperty1:Int? {',
            '        get {',
            '            return bjs.getInt(bjs.getProperty(self.bjsClass, "staticProperty1"))',
            '        }',
            '        set {',
            '            bjs.setProperty(self.bjsClass, "staticProperty1", bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    class var staticProperty2:Int? {',
            '        get {',
            '            return bjs.getInt(bjs.getProperty(self.bjsClass, "staticProperty2"))',
            '        }',
            '        set {',
            '            bjs.setProperty(self.bjsClass, "staticProperty2", bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    class func staticMethod1() -> Int? {',
            '        return bjs.getInt(bjs.call(self.bjsClass, "staticMethod1"))',
            '    }',
            '    ',
            '    class func staticMethod2() -> Int? {',
            '        return bjs.getInt(bjs.call(self.bjsClass, "staticMethod2"))',
            '    }',
            '    ',
            '    convenience init() {',
            '        self.init(Class1.bjsClass, [])',
            '    }',
            '    ',
            '    var instanceProperty1:Int? {',
            '        get {',
            '            return Class1.bjs.getInt(bjsGetProperty("instanceProperty1"))',
            '        }',
            '        set {',
            '            bjsSetProperty("instanceProperty1", Class1.bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    var instanceProperty2:Int? {',
            '        get {',
            '            return Class1.bjs.getInt(bjsGetProperty("instanceProperty2"))',
            '        }',
            '        set {',
            '            bjsSetProperty("instanceProperty2", Class1.bjs.putPrimitive(newValue))',
            '        }',
            '    }',
            '    ',
            '    func instanceMethod1() -> Int? {',
            '        return Class1.bjs.getInt(bjsCall("instanceMethod1"))',
            '    }',
            '    ',
            '    func instanceMethod2() -> Int? {',
            '        return Class1.bjs.getInt(bjsCall("instanceMethod2"))',
            '    }',
            '    ',
            ...expectedModulePathVar,
            ...expectedFactoryMethod,
            '}')
    })

    function getScaffold(constructors, properties, methods, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, false, 'superModule/path')
            : null
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superclass, false, 'module/path')
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
            new Property('instanceProperty1', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty1', 'desc', true, intType, ['get', 'set']),
            new Property('instanceProperty2', 'desc', false, intType, ['get', 'set']),
            new Property('staticProperty2', 'desc', true, intType, ['get', 'set']),
        ]
        const methods = [
            new Method('instanceMethod1', 'desc', false, intType, []),
            new Method('staticMethod1', 'desc', true, intType, []),
            new Method('instanceMethod2', 'desc', false, intType, []),
            new Method('staticMethod2', 'desc', true, intType, []),
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