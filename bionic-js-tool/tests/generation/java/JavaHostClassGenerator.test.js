const t = require('../../test-utils')

describe('JavaHostClassGenerator', () => {

    let Class, Constructor, Property, Method, IntType,
        expectedImports, expectedClassDeclaration, expectedFactoryMethod, expectedModulePathVar

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType

        expectedImports = [
            'package test.java.host;',
            '',
            'import jjbridge.api.runtime.JSReference;',
            'import jjbridge.api.value.strategy.FunctionCallback;',
            'import bionic.js.Bjs;',
            'import bionic.js.BjsAnyObject;',
            'import bionic.js.BjsTypeInfo;',
            'import bionic.js.BjsObjectTypeInfo;',
            'import bionic.js.Lambda;',
            'import java.util.Date;',
            'import bionic.js.BjsObject;',
            '']

        expectedModulePathVar = [
            '@BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")'
        ]

        expectedClassDeclaration = [
            'public class Class1 extends BjsObject {',
            '    ']

        expectedFactoryMethod = [
            '    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Class1.class).bjsClass();',
            '    public static final Bjs bjs = BjsObjectTypeInfo.get(Class1.class).bjsLocator.get();',
            '    public static final Bjs.JSReferenceConverter<Class1> bjsFactory = Class1::new;',
        ]
    })

    function getCode(constructors, properties, methods, superclassName, superclassPath) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, false, superclassPath)
            : null
        const clazz = new Class('Class1', 'class description', constructors, properties, methods, superclass, false, 'host/Class1')
        return clazz.generator.forHosting('Project1', 'test.java').java.getSource()
    }

    test('empty class without inheritance', () => {
        const code = getCode([], [], [])

        t.expectCode(code,
            ...expectedImports,
            ...expectedModulePathVar,
            ...expectedClassDeclaration,
            '    protected <T extends BjsObject> Class1(Class<T> type, JSReference jsObject) {',
            '        super(type, jsObject);',
            '    }',
            '    ',
            '    protected <T extends BjsObject> Class1(Class<T> type, JSReference[] arguments) {',
            '        super(type, arguments);',
            '    }',
            '    ',
            '    public Class1(JSReference jsObject) {',
            '        this(Class1.class, jsObject);',
            '    }',
            '    ',
            ...expectedFactoryMethod,
            '}')
    })

    test('empty class with inheritance', () => {
        const code = getCode([], [], [], 'Superclass', 'subpackage/Superclass')

        t.expectCode(code,
            'package test.java.host;',
            '',
            'import jjbridge.api.runtime.JSReference;',
            'import jjbridge.api.value.strategy.FunctionCallback;',
            'import bionic.js.Bjs;',
            'import bionic.js.BjsAnyObject;',
            'import bionic.js.BjsTypeInfo;',
            'import bionic.js.BjsObjectTypeInfo;',
            'import bionic.js.Lambda;',
            'import java.util.Date;',
            'import test.java.subpackage.Superclass;',
            '',
            ...expectedModulePathVar,
            'public class Class1 extends Superclass {',
            '    ',
            '    protected <T extends Superclass> Class1(Class<T> type, JSReference jsObject) {',
            '        super(type, jsObject);',
            '    }',
            '    ',
            '    protected <T extends Superclass> Class1(Class<T> type, JSReference[] arguments) {',
            '        super(type, arguments);',
            '    }',
            '    ',
            '    public Class1(JSReference jsObject) {',
            '        this(Class1.class, jsObject);',
            '    }',
            '    ',
            ...expectedFactoryMethod,
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
            ...expectedModulePathVar,
            ...expectedClassDeclaration,
            '    protected <T extends BjsObject> Class1(Class<T> type, JSReference jsObject) {',
            '        super(type, jsObject);',
            '    }',
            '    ',
            '    protected <T extends BjsObject> Class1(Class<T> type, JSReference[] arguments) {',
            '        super(type, arguments);',
            '    }',
            '    ',
            '    public Class1(JSReference jsObject) {',
            '        this(Class1.class, jsObject);',
            '    }',
            '    ',
            '    public static Integer staticProperty1() {',
            '        return bjs.getInteger(bjs.getProperty(bjsClass, "staticProperty1"));',
            '    }',
            '    public static void staticProperty1(Integer value) {',
            '        bjs.setProperty(bjsClass, "staticProperty1", bjs.putPrimitive(value));',
            '    }',
            '    ',
            '    public static Integer staticProperty2() {',
            '        return bjs.getInteger(bjs.getProperty(bjsClass, "staticProperty2"));',
            '    }',
            '    public static void staticProperty2(Integer value) {',
            '        bjs.setProperty(bjsClass, "staticProperty2", bjs.putPrimitive(value));',
            '    }',
            '    ',
            '    public static Integer staticMethod1() {',
            '        return bjs.getInteger(bjs.call(bjsClass, "staticMethod1"));',
            '    }',
            '    ',
            '    public static Integer staticMethod2() {',
            '        return bjs.getInteger(bjs.call(bjsClass, "staticMethod2"));',
            '    }',
            '    ',
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1() {',
            '        this(bjs_Class1());',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1() {',
            '        return new JSReference[]{};',
            '    }',
            '    ',
            '    public Integer instanceProperty1() {',
            '        return bjs.getInteger(bjsGetProperty("instanceProperty1"));',
            '    }',
            '    public void instanceProperty1(Integer value) {',
            '        bjsSetProperty("instanceProperty1", bjs.putPrimitive(value));',
            '    }',
            '    ',
            '    public Integer instanceProperty2() {',
            '        return bjs.getInteger(bjsGetProperty("instanceProperty2"));',
            '    }',
            '    public void instanceProperty2(Integer value) {',
            '        bjsSetProperty("instanceProperty2", bjs.putPrimitive(value));',
            '    }',
            '    ',
            '    public Integer instanceMethod1() {',
            '        return bjs.getInteger(bjsCall("instanceMethod1"));',
            '    }',
            '    ',
            '    public Integer instanceMethod2() {',
            '        return bjs.getInteger(bjsCall("instanceMethod2"));',
            '    }',
            '    ',
            ...expectedFactoryMethod,
            '}')
    })

    function getScaffold(constructors, properties, methods, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, false, 'superModule/path')
            : null
        const class1 = new Class('Class1', 'class description', constructors, properties, methods, superclass, false, 'host/Class1')
        return class1.generator.forHosting(undefined, 'test.java').java.getScaffold()
    }

    test('empty class without inheritance, scaffold', () => {
        const scaffold = getScaffold([], [], [])

        t.expectCode(scaffold,
            'import test.java.host.Class1BjsExport;',
            '',
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '}')
    })

    test('empty class with inheritance, scaffold', () => {
        const scaffold = getScaffold([], [], [], 'Superclass')

        t.expectCode(scaffold,
            'import test.java.host.Class1BjsExport;',
            '',
            'public class Class1 extends Superclass implements Class1BjsExport {',
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
            'import test.java.host.Class1BjsExport;',
            '',
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public static Integer staticProperty1() {',
            '        ',
            '    }',
            '    public static void staticProperty1(Integer value) {',
            '        ',
            '    }',
            '    ',
            '    public static Integer staticProperty2() {',
            '        ',
            '    }',
            '    public static void staticProperty2(Integer value) {',
            '        ',
            '    }',
            '    ',
            '    public static Integer staticMethod1() {',
            '        ',
            '    }',
            '    ',
            '    public static Integer staticMethod2() {',
            '        ',
            '    }',
            '    ',
            '    public Class1() {',
            '        ',
            '    }',
            '    ',
            '    public Integer instanceProperty1() {',
            '        ',
            '    }',
            '    public void instanceProperty1(Integer value) {',
            '        ',
            '    }',
            '    ',
            '    public Integer instanceProperty2() {',
            '        ',
            '    }',
            '    public void instanceProperty2(Integer value) {',
            '        ',
            '    }',
            '    ',
            '    public Integer instanceMethod1() {',
            '        ',
            '    }',
            '    ',
            '    public Integer instanceMethod2() {',
            '        ',
            '    }',
            '}')
    })
})