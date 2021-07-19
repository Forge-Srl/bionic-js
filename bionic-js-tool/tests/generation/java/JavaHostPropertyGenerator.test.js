const t = require('../../test-utils')

describe('JavaHostPropertyGenerator', () => {

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

        expectedHeader = (additionalImports = []) => [
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
            ...additionalImports,
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

    function getCode(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set'],
                     propertyName = 'property1') {
        const class1 = new Class('Class1', '', [], [new Property(propertyName, 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, false, 'host/Class1')
        return class1.generator.forHosting('Project1', 'test.java', [
            {name: 'ClassName', relativePath: 'other/ClassName.js'}
        ]).java.getSource()
    }

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, ['get'])

        t.expectCode(code,
            ...expectedHeader(),
            '    public static Long property1() {',
            '        return bjs.getLong(bjs.getProperty(bjsClass, "property1"));',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only getter, reserved keyword', () => {
        const code = getCode(new IntType(), false, ['get'], 'default')

        t.expectCode(code,
            ...expectedHeader(),
            '    public Long $default$() {',
            '        return bjs.getLong(bjsGetProperty("default"));',
            '    }',
            ...expectedFooter)
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedHeader(),
            '    public static void property1(Long value) {',
            '        bjs.setProperty(bjsClass, "property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('IntType, static', () => {
        const code = getCode(new IntType(), true)

        t.expectCode(code,
            ...expectedHeader(),
            '    public static Long property1() {',
            '        return bjs.getLong(bjs.getProperty(bjsClass, "property1"));',
            '    }',
            '    public static void property1(Long value) {',
            '        bjs.setProperty(bjsClass, "property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('JsRefType', () => {
        const code = getCode(new JsRefType())

        t.expectCode(code,
            ...expectedHeader(),
            '    public BjsAnyObject property1() {',
            '        return bjs.getAny(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(BjsAnyObject value) {',
            '        bjsSetProperty("property1", value.jsObj);',
            '    }',
            ...expectedFooter)
    })

    test('ArrayType', () => {
        const code = getCode(new ArrayType(new ArrayType(new IntType())))

        t.expectCode(code,
            ...expectedHeader(),
            '    public Long[][] property1() {',
            '        return bjs.getArray(bjsGetProperty("property1"), r_bjs0 -> {',
            '            return bjs.getArray(r_bjs0, r_bjs1 -> {',
            '                return bjs.getLong(r_bjs1);',
            '            }, Long.class);',
            '        }, Long[].class);',
            '    }',
            '    public void property1(Long[][] value) {',
            '        bjsSetProperty("property1", bjs.putArray(value, nv_bjs0 -> {',
            '            return bjs.putArray(nv_bjs0, nv_bjs1 -> {',
            '                return bjs.putPrimitive(nv_bjs1);',
            '            });',
            '        }));',
            '    }',
            ...expectedFooter)
    })

    test('BoolType', () => {
        const code = getCode(new BoolType())

        t.expectCode(code,
            ...expectedHeader(),
            '    public Boolean property1() {',
            '        return bjs.getBoolean(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(Boolean value) {',
            '        bjsSetProperty("property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('DateType', () => {
        const code = getCode(new DateType())

        t.expectCode(code,
            ...expectedHeader(),
            '    public Date property1() {',
            '        return bjs.getDate(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(Date value) {',
            '        bjsSetProperty("property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('FloatType', () => {
        const code = getCode(new FloatType())

        t.expectCode(code,
            ...expectedHeader(),
            '    public Double property1() {',
            '        return bjs.getDouble(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(Double value) {',
            '        bjsSetProperty("property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('LambdaType', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const voidLambdaParam = new Parameter(voidLambda, 'voidLambda', 'void lambda description')
        const code = getCode(new LambdaType(voidLambda, [voidLambdaParam]))

        t.expectCode(code,
            ...expectedHeader(),
            '    public Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> property1() {',
            '        JSReference jsFunc_bjs0 = bjsGetProperty("property1");',
            '        return bjs.getFunc(jsFunc_bjs0, (Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>>) (jsFunc_bjs0_v0) -> {',
            '            Lambda.F0<Void> nativeFunc_bjs1 = jsFunc_bjs0_v0;',
            '            FunctionCallback<?> jsFunc_bjs2 = jsReferences_bjs3 -> {',
            '                jsReferences_bjs3 = bjs.ensureArraySize(jsReferences_bjs3, 0);',
            '                nativeFunc_bjs1.apply();',
            '                return bjs.jsUndefined();',
            '            };',
            '            JSReference jsFunc_bjs4 = bjs.funcCall(jsFunc_bjs0, bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2));',
            '            return bjs.getFunc(jsFunc_bjs4, (Lambda.F0<Void>) () -> {',
            '                bjs.funcCall(jsFunc_bjs4);',
            '                return null;',
            '            });',
            '        });',
            '    }',
            '    public void property1(Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> value) {',
            '        Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> nativeFunc_bjs0 = value;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 1);',
            '            JSReference jsFunc_bjs3 = jsReferences_bjs2[0];',
            '            Lambda.F0<Void> nativeFunc_bjs4 = nativeFunc_bjs0.apply(bjs.getFunc(jsFunc_bjs3, (Lambda.F0<Void>) () -> {',
            '                bjs.funcCall(jsFunc_bjs3);',
            '                return null;',
            '            }));',
            '            FunctionCallback<?> jsFunc_bjs5 = jsReferences_bjs6 -> {',
            '                jsReferences_bjs6 = bjs.ensureArraySize(jsReferences_bjs6, 0);',
            '                nativeFunc_bjs4.apply();',
            '                return bjs.jsUndefined();',
            '            };',
            '            return bjs.putFunc(nativeFunc_bjs4, jsFunc_bjs5);',
            '        };',
            '        bjsSetProperty("property1", bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1));',
            '    }',
            ...expectedFooter)
    })

    test('JsClassType', () => {
        const code = getCode(new JsClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader(['import test.java.other.ClassName;']),
            '    public ClassName property1() {',
            '        return bjs.getObj(bjsGetProperty("property1"), ClassName.bjsFactory, ClassName.class);',
            '    }',
            '    public void property1(ClassName value) {',
            '        bjsSetProperty("property1", bjs.putObj(value));',
            '    }',
            ...expectedFooter)
    })

    test('StringType', () => {
        const code = getCode(new StringType())

        t.expectCode(code,
            ...expectedHeader(),
            '    public String property1() {',
            '        return bjs.getString(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(String value) {',
            '        bjsSetProperty("property1", bjs.putPrimitive(value));',
            '    }',
            ...expectedFooter)
    })

    test('NativeClassType', () => {
        const code = getCode(new NativeClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader(['import test.java.other.ClassNameBjsExport;']),
            '    public ClassNameBjsExport property1() {',
            '        return bjs.getWrapped(bjsGetProperty("property1"));',
            '    }',
            '    public void property1(ClassNameBjsExport value) {',
            '        bjsSetProperty("property1", bjs.putWrapped(value, ClassNameBjsExport.Wrapper.class));',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set'],
                         propertyName = 'property1') {
        const class1 = new Class('Class1', '', [], [new Property(propertyName, 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, false, 'host/Class1')
        return class1.generator.forHosting(undefined, 'test.java', []).java.getScaffold()
    }

    const expectedScaffoldHeader = [
        'import test.java.host.Class1BjsExport;',
        '']

    test('IntType, scaffold, only setter, static', () => {
        const code = getScaffold(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public static void property1(Long value) {',
            '        ',
            '    }',
            '}')
    })

    test('IntType, scaffold, only getter', () => {
        const code = getScaffold(new IntType(), false, ['get'])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public Long property1() {',
            '        ',
            '    }',
            '}')
    })

    test('LambdaType, scaffold, reserved keyword, only setter', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const voidLambdaParam = new Parameter(voidLambda, 'voidLambda')
        const code = getScaffold(new LambdaType(voidLambda, [voidLambdaParam]), false, ['set'], 'return')

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public void $return$(Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> value) {',
            '        ',
            '    }',
            '}')
    })

    test('IntType, scaffold, getter and setter', () => {
        const code = getScaffold(new IntType(), false)

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public Long property1() {',
            '        ',
            '    }',
            '    public void property1(Long value) {',
            '        ',
            '    }',
            '}')
    })
})