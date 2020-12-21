const t = require('../../test-utils')

describe('JavaHostConstructorGenerator', () => {

    let Class, Constructor, Parameter, VoidType, BoolType, IntType, ArrayType, LambdaType,
        expectedHeader,
        expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType

        expectedHeader = [
            'package test.java.host;',
            '',
            'import jjbridge.api.runtime.JSReference;',
            'import bionic.js.Bjs;',
            'import bionic.js.BjsTypeInfo;',
            'import bionic.js.BjsObjectTypeInfo;',
            'import bionic.js.BjsObject;',
            '',
            '@BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
            'public class Class1 extends BjsObject {',
            '    ']

        expectedFooter = [
            '    ',
            '    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Class1.class).bjsClass();',
            '    public static final Bjs bjs = BjsObjectTypeInfo.get(Class1.class).bjsLocator.get();',
            '    public static final Bjs.JSReferenceConverter<Class1> bjsFactory = Class1::new;',
            '}']
    })

    function getCode(constructorParameters, superclassName) {
        const superclass = superclassName
            ? new Class(superclassName, `${superclassName} description`, [], [], [], null, false, `subpackage/${superclassName}`)
            : null
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)],
            [], [], superclass, false, 'host/Class1')
        return class1.generator.forHosting('Project1', 'test.java').java.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    test('no params', () => {
        const code = getCode([])

        t.expectCode(code,
            ...expectedHeader,
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
            ...expectedFooter)
    })

    test('no params subclass', () => {
        const code = getCode([], 'Superclass')

        t.expectCode(code,
            'package test.java.host;',
            '',
            'import jjbridge.api.runtime.JSReference;',
            'import bionic.js.Bjs;',
            'import bionic.js.BjsTypeInfo;',
            'import bionic.js.BjsObjectTypeInfo;',
            'import test.java.subpackage.Superclass;',
            '',
            '@BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
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
            ...expectedFooter)
    })

    test('single primitive', () => {
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([intPar])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Integer intParam) {',
            '        this(bjs_Class1(intParam));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Integer intParam) {',
            '        return new JSReference[]{bjs.putPrimitive(intParam)};',
            '    }',
            ...expectedFooter)
    })

    test('multiple primitives', () => {
        const boolPar = newParam(new BoolType(), 'boolParam')
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([boolPar, intPar])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Boolean boolParam, Integer intParam) {',
            '        this(bjs_Class1(boolParam, intParam));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Boolean boolParam, Integer intParam) {',
            '        return new JSReference[]{bjs.putPrimitive(boolParam), bjs.putPrimitive(intParam)};',
            '    }',
            ...expectedFooter)
    })

    test('void lambda', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')

        const code = getCode([voidLambdaParam])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Lambda.F0<Void> voidNativeFunc) {',
            '        this(bjs_Class1(voidNativeFunc));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Lambda.F0<Void> voidNativeFunc) {',
            '        Lambda.F0<Void> nativeFunc_bjs0 = voidNativeFunc;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 0);',
            '            nativeFunc_bjs0.apply();',
            '            return bjs.jsUndefined();',
            '        };',
            '        return new JSReference[]{bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1)};',
            '    }',
            ...expectedFooter)
    })

    test('void lambda, lambda returning primitive, primitive', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')
        const intLambdaParam = newParam(new LambdaType(new IntType(), []), 'intNativeFunc')
        const arrayLambdaParam = newParam(new LambdaType(new ArrayType(new IntType()), []), 'arrayNativeFunc')
        const intParam = newParam(new IntType(), 'intPar')

        const code = getCode([voidLambdaParam, intLambdaParam, arrayLambdaParam, intParam])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Lambda.F0<Void> voidNativeFunc, Lambda.F0<Integer> intNativeFunc, Lambda.F0<Integer[]> arrayNativeFunc, Integer intPar) {',
            '        this(bjs_Class1(voidNativeFunc, intNativeFunc, arrayNativeFunc, intPar));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Lambda.F0<Void> voidNativeFunc, Lambda.F0<Integer> intNativeFunc, Lambda.F0<Integer[]> arrayNativeFunc, Integer intPar) {',
            '        Lambda.F0<Void> nativeFunc_bjs0 = voidNativeFunc;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 0);',
            '            nativeFunc_bjs0.apply();',
            '            return bjs.jsUndefined();',
            '        };',
            '        Lambda.F0<Integer> nativeFunc_bjs3 = intNativeFunc;',
            '        FunctionCallback<?> jsFunc_bjs4 = jsReferences_bjs5 -> {',
            '            jsReferences_bjs5 = bjs.ensureArraySize(jsReferences_bjs5, 0);',
            '            return bjs.putPrimitive(nativeFunc_bjs3.apply());',
            '        };',
            '        Lambda.F0<Integer[]> nativeFunc_bjs6 = arrayNativeFunc;',
            '        FunctionCallback<?> jsFunc_bjs7 = jsReferences_bjs8 -> {',
            '            jsReferences_bjs8 = bjs.ensureArraySize(jsReferences_bjs8, 0);',
            '            return bjs.putArray(nativeFunc_bjs6.apply(), nv_bjs9 -> {',
            '                return bjs.putPrimitive(nv_bjs9);',
            '            });',
            '        };',
            '        return new JSReference[]{bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1), bjs.putFunc(nativeFunc_bjs3, jsFunc_bjs4), bjs.putFunc(nativeFunc_bjs6, jsFunc_bjs7), bjs.putPrimitive(intPar)};',
            '    }',
            ...expectedFooter)
    })

    test('lambda returning lambda returning void lambda', () => {
        const chainLambda = new LambdaType(new LambdaType(new LambdaType(new VoidType(), []), []), [])
        const funcReturningFuncReturningVoidFunc = newParam(chainLambda, 'funcReturningFuncReturningVoidFunc')

        const code = getCode([funcReturningFuncReturningVoidFunc])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Lambda.F0<Lambda.F0<Lambda.F0<Void>>> funcReturningFuncReturningVoidFunc) {',
            '        this(bjs_Class1(funcReturningFuncReturningVoidFunc));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Lambda.F0<Lambda.F0<Lambda.F0<Void>>> funcReturningFuncReturningVoidFunc) {',
            '        Lambda.F0<Lambda.F0<Lambda.F0<Void>>> nativeFunc_bjs0 = funcReturningFuncReturningVoidFunc;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 0);',
            '            Lambda.F0<Lambda.F0<Void>> nativeFunc_bjs3 = nativeFunc_bjs0.apply();',
            '            FunctionCallback<?> jsFunc_bjs4 = jsReferences_bjs5 -> {',
            '                jsReferences_bjs5 = bjs.ensureArraySize(jsReferences_bjs5, 0);',
            '                Lambda.F0<Void> nativeFunc_bjs6 = nativeFunc_bjs3.apply();',
            '                FunctionCallback<?> jsFunc_bjs7 = jsReferences_bjs8 -> {',
            '                    jsReferences_bjs8 = bjs.ensureArraySize(jsReferences_bjs8, 0);',
            '                    nativeFunc_bjs6.apply();',
            '                    return bjs.jsUndefined();',
            '                };',
            '                return bjs.putFunc(nativeFunc_bjs6, jsFunc_bjs7);',
            '            };',
            '            return bjs.putFunc(nativeFunc_bjs3, jsFunc_bjs4);',
            '        };',
            '        return new JSReference[]{bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1)};',
            '    }',
            ...expectedFooter)
    })

    test('lambda taking lambda taking void lambda', () => {
        const voidFunc = newParam(new LambdaType(new VoidType(), []))
        const func2TakingVoidFunc = newParam(new LambdaType(new VoidType(), [voidFunc]), 'func2TakingVoidFunc')
        const func1TakingFunc2 = newParam(new LambdaType(new VoidType(), [func2TakingVoidFunc]), 'func1TakingFunc2')

        const code = getCode([func1TakingFunc2])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Lambda.F1<Lambda.F1<Lambda.F0<Void>, Void>, Void> func1TakingFunc2) {',
            '        this(bjs_Class1(func1TakingFunc2));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Lambda.F1<Lambda.F1<Lambda.F0<Void>, Void>, Void> func1TakingFunc2) {',
            '        Lambda.F1<Lambda.F1<Lambda.F0<Void>, Void>, Void> nativeFunc_bjs0 = func1TakingFunc2;',
            '        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 1);',
            '            JSReference jsFunc_bjs3 = jsReferences_bjs2[0];',
            '            nativeFunc_bjs0.apply(bjs.getFunc(jsFunc_bjs3, (jsFunc_bjs3_v0) -> {',
            '                Lambda.F0<Void> nativeFunc_bjs4 = jsFunc_bjs3_v0;',
            '                FunctionCallback<?> jsFunc_bjs5 = jsReferences_bjs6 -> {',
            '                    jsReferences_bjs6 = bjs.ensureArraySize(jsReferences_bjs6, 0);',
            '                    nativeFunc_bjs4.apply();',
            '                    return bjs.jsUndefined();',
            '                };',
            '                bjs.funcCall(jsFunc_bjs3, bjs.putFunc(nativeFunc_bjs4, jsFunc_bjs5));',
            '                return null;',
            '            }));',
            '            return bjs.jsUndefined();',
            '        };',
            '        return new JSReference[]{bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1)};',
            '    }',
            ...expectedFooter)
    })

    test('array of lambdas taking and returning array of void lambdas', () => {
        const arrayOfVoidLambda = new ArrayType(new LambdaType(new VoidType(), []))
        const arrayOfVoidLambdaPar = newParam(arrayOfVoidLambda, 'arrayOfVoidLambdas')
        const lambda1 = new LambdaType(arrayOfVoidLambda, [arrayOfVoidLambdaPar])
        const arrayOfLambda1 = newParam(new ArrayType(lambda1), 'arrayOfLambda1')

        const code = getCode([arrayOfLambda1])

        t.expectCode(code,
            ...expectedHeader,
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
            '    public Class1(JSReference[] arguments) {',
            '        this(Class1.class, arguments);',
            '    }',
            '    ',
            '    public Class1(Lambda.F1<Lambda.F0<Void>[], Lambda.F0<Void>[]>[] arrayOfLambda1) {',
            '        this(bjs_Class1(arrayOfLambda1));',
            '    }',
            '    ',
            '    private static JSReference[] bjs_Class1(Lambda.F1<Lambda.F0<Void>[], Lambda.F0<Void>[]>[] arrayOfLambda1) {',
            '        return new JSReference[]{bjs.putArray(arrayOfLambda1, nv_bjs0 -> {',
            '            Lambda.F1<Lambda.F0<Void>[], Lambda.F0<Void>[]> nativeFunc_bjs1 = nv_bjs0;',
            '            FunctionCallback<?> jsFunc_bjs2 = jsReferences_bjs3 -> {',
            '                jsReferences_bjs3 = bjs.ensureArraySize(jsReferences_bjs3, 1);',
            '                return bjs.putArray(nativeFunc_bjs1.apply(bjs.getArray(jsReferences_bjs3[0], r_bjs4 -> {',
            '                    JSReference jsFunc_bjs5 = r_bjs4;',
            '                    return bjs.getFunc(jsFunc_bjs5, () -> {',
            '                        bjs.funcCall(jsFunc_bjs5);',
            '                        return null;',
            '                    });',
            '                }, Lambda.F0<Void>.class)), nv_bjs6 -> {',
            '                    Lambda.F0<Void> nativeFunc_bjs7 = nv_bjs6;',
            '                    FunctionCallback<?> jsFunc_bjs8 = jsReferences_bjs9 -> {',
            '                        jsReferences_bjs9 = bjs.ensureArraySize(jsReferences_bjs9, 0);',
            '                        nativeFunc_bjs7.apply();',
            '                        return bjs.jsUndefined();',
            '                    };',
            '                    return bjs.putFunc(nativeFunc_bjs7, jsFunc_bjs8);',
            '                });',
            '            };',
            '            return bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2);',
            '        })};',
            '    }',
            ...expectedFooter)
    })

    function getScaffold(constructorParameters) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [],
            [], null, false, 'host/Class1')
        return class1.generator.forHosting(undefined, 'test.java').java.getScaffold()
    }

    const expectedScaffoldHeader = [
        'import test.java.host.Class1BjsExport;',
        '']

    test('no params, scaffold', () => {
        const code = getScaffold([])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public Class1() {',
            '        ',
            '    }',
            '}')
    })

    test('single primitive, scaffold', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const code = getScaffold([intPar])

        t.expectCode(code,
            ...expectedScaffoldHeader,
            'public class Class1 implements Class1BjsExport {',
            '    ',
            '    public Class1(Integer intParam) {',
            '        ',
            '    }',
            '}')
    })
})