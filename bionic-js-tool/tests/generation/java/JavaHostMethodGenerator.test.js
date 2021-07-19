const t = require('../../test-utils')

describe('JavaHostMethodGenerator', () => {

    let Class, Method, Parameter, VoidType, BoolType, IntType, LambdaType, expectedHeader, expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType

        expectedHeader = [
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
            '',
            '@BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
            'public class Class1 extends BjsObject {',
            '    ',
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
        ]

        expectedFooter = [
            '    ',
            '    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Class1.class).bjsClass();',
            '    public static final Bjs bjs = BjsObjectTypeInfo.get(Class1.class).bjsLocator.get();',
            '    public static final Bjs.JSReferenceConverter<Class1> bjsFactory = Class1::new;',
            '}']
    })

    function getCode(isMethodStatic, methodReturnType, methodParameters, methodName = 'method1') {
        const class1 = new Class('Class1', '', [], [], [new Method(methodName, 'method description', isMethodStatic,
            methodReturnType, methodParameters)], null, false, 'host/Class1')
        return class1.generator.forHosting('Project1', 'test.java').java.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    test('void return, no params', () => {
        const code = getCode(false, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    public void method1() {',
            '        bjsCall("method1");',
            '    }',
            ...expectedFooter)
    })

    test('void return, reserved keyword', () => {
        const code = getCode(false, new VoidType(), [], 'default')

        t.expectCode(code,
            ...expectedHeader,
            '    public void $default$() {',
            '        bjsCall("default");',
            '    }',
            ...expectedFooter)
    })

    test('void return, no params, static', () => {
        const code = getCode(true, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    public static void method1() {',
            '        bjs.call(bjsClass, "method1");',
            '    }',
            ...expectedFooter)
    })

    test('primitive return, primitive param', () => {
        const code = getCode(false, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            '    public Long method1(Boolean boolParam) {',
            '        return bjs.getLong(bjsCall("method1", bjs.putPrimitive(boolParam)));',
            '    }',
            ...expectedFooter)
    })

    test('multiple primitive params', () => {
        const code = getCode(false, new VoidType(), [
            newParam(new BoolType(), 'boolParam'),
            newParam(new IntType(), 'intParam'),
        ])

        t.expectCode(code,
            ...expectedHeader,
            '    public void method1(Boolean boolParam, Long intParam) {',
            '        bjsCall("method1", bjs.putPrimitive(boolParam), bjs.putPrimitive(intParam));',
            '    }',
            ...expectedFooter)
    })

    test('void lambda return, void lambda param', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getCode(false, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedHeader,
            '    public Lambda.F0<Void> method1(Lambda.F0<Void> voidLambda) {',
            '        Lambda.F0<Void> nativeFunc_bjs0 = voidLambda;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 0);',
            '            nativeFunc_bjs0.apply();',
            '            return bjs.jsUndefined();',
            '        };',
            '        JSReference jsFunc_bjs3 = bjsCall("method1", bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1));',
            '        return bjs.getFunc(jsFunc_bjs3, (Lambda.F0<Void>) () -> {',
            '            bjs.funcCall(jsFunc_bjs3);',
            '            return null;',
            '        });',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(isMethodStatic, methodReturnType, methodParameters, methodName = 'method1') {
        const class1 = new Class('Class1', '', [], [], [new Method(methodName, 'method description', isMethodStatic,
            methodReturnType, methodParameters)], null, false, 'host/Class1')
        return class1.generator.forHosting(undefined, 'test.java').java.getScaffold()
    }

    const expectedScaffoldHeader = [
        'import test.java.host.Class1BjsExport;',
        '']

    test('void return, no params, scaffold', () => {
        const code = getScaffold(false, new VoidType(), [])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public void method1() {',
            '        ',
            '    }',
            '}')
    })

    test('void return, no params, reserved keyword, scaffold', () => {
        const code = getScaffold(false, new VoidType(), [], 'throws')

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public void $throws$() {',
            '        ',
            '    }',
            '}')
    })

    test('void lambda return, void lambda param, static, scaffold', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getScaffold(true, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public static Lambda.F0<Void> method1(Lambda.F0<Void> voidLambda) {',
            '        ',
            '    }',
            '}')
    })
})