const t = require('../../test-utils')

describe('JavaWrapperMethodGenerator', () => {

    let Class, Method, Parameter, VoidType, BoolType, IntType, LambdaType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    function getCode(isMethodStatic, methodReturnType, methodParameters) {
        const class1 = new Class('Class1', '', [], [], [new Method('method1', 'method description', isMethodStatic,
            methodReturnType, methodParameters)], null, true, 'wrapper/Class1')
        return class1.generator.forWrapping(undefined, 'Project1', 'test.java').java.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    const expectedHeader = [
        'package test.java.wrapper;',
        '',
        'import bionic.js.Bjs;',
        'import bionic.js.BjsNativeExports;',
        'import bionic.js.BjsNativeWrapper;',
        'import bionic.js.BjsNativeWrapperTypeInfo;',
        'import bionic.js.BjsTypeInfo;',
        'import bionic.js.Lambda;',
        'import jjbridge.api.value.strategy.FunctionCallback;',
        'import java.util.Date;',
        'import bionic.js.BjsExport;',
        '',
        `public interface Class1BjsExport extends BjsExport {`,
        '    ',
        '    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();',
        '    ',
    ]

    const expectedFooter = [
        '    }',
        '}']

    function getFunctionsExportCode(functionExports = []) {
        return [
            '    @BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
            `    class Wrapper<T extends Class1BjsExport> extends BjsNativeWrapper<T> {`,
            '        ',
            '        private static Wrapper<?> wrapper;',
            '        private static Wrapper<?> getInstance() {',
            '            if (wrapper == null) {',
            '                wrapper = new Wrapper<>(getClass(Class1BjsExport.class, "Class1"));',
            '            }',
            '            return wrapper;',
            '        }',
            '        ',
            '        protected Wrapper(Class<T> realImplementation) {',
            '            super(realImplementation);',
            '        }',
            '        ',
            '        @BjsNativeWrapperTypeInfo.Exporter',
            '        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {',
            '            Wrapper<?> singleton = getInstance();',
            '            return nativeExports',
            ...functionExports.map((code, index) => `                ${code}${index === functionExports.length-1 ? ';' : ''}`),
            '        }',
            '        ',
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
        ]
    }

    test('void return, no params', () => {
        const code = getCode(false, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            '    void method1();',
            '    ',
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", singleton.bjs_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjs_method1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).method1();',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('void return, no params, static', () => {
        const code = getCode(true, new VoidType(), [])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStatic_method1", singleton.bjsStatic_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjsStatic_method1() {',
            '            return jsReferences -> {',
            '                invokeStatic("method1", new Class[]{}, new Object[]{});',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('void return, primitive param, static', () => {
        const code = getCode(true, new VoidType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStatic_method1", singleton.bjsStatic_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjsStatic_method1() {',
            '            return jsReferences -> {',
            '                invokeStatic("method1", new Class[]{Boolean.class}, new Object[]{bjs.getBoolean(jsReferences[0])});',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('primitive return, primitive param', () => {
        const code = getCode(false, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            '    Integer method1(Boolean boolParam);',
            '    ',
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", singleton.bjs_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjs_method1() {',
            '            return jsReferences -> {',
            '                return bjs.putPrimitive(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).method1(bjs.getBoolean(jsReferences[1])));',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('primitive return, primitive param, static', () => {
        const code = getCode(true, new IntType(), [newParam(new BoolType(), 'boolParam')])

        t.expectCode(code,
            ...expectedHeader,
            ...getFunctionsExportCode(['.exportFunction("bjsStatic_method1", singleton.bjsStatic_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjsStatic_method1() {',
            '            return jsReferences -> {',
            '                Integer result_bjs0 = invokeStatic("method1", new Class[]{Boolean.class}, new Object[]{bjs.getBoolean(jsReferences[0])});',
            '                return bjs.putPrimitive(result_bjs0);',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('multiple primitive params', () => {
        const code = getCode(false, new VoidType(), [
            newParam(new BoolType(), 'boolParam'),
            newParam(new IntType(), 'intParam'),
        ])

        t.expectCode(code,
            ...expectedHeader,
            '    void method1(Boolean boolParam, Integer intParam);',
            '    ',
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", singleton.bjs_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjs_method1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).method1(bjs.getBoolean(jsReferences[1]), bjs.getInteger(jsReferences[2]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('void lambda return, void lambda param', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const code = getCode(false, voidLambda, [newParam(voidLambda, 'voidLambda')])

        t.expectCode(code,
            ...expectedHeader,
            '    Lambda.F0<Void> method1(Lambda.F0<Void> voidLambda);',
            '    ',
            ...getFunctionsExportCode(['.exportFunction("bjs_method1", singleton.bjs_method1())']),
            '        ',
            '        protected FunctionCallback<?> bjs_method1() {',
            '            return jsReferences -> {',
            '                JSReference jsFunc_bjs0 = jsReferences[1];',
            '                Lambda.F0<Void> nativeFunc_bjs1 = ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).method1(bjs.getFunc(jsFunc_bjs0, () -> {',
            '                    bjs.funcCall(jsFunc_bjs0);',
            '                    return null;',
            '                }));',
            '                FunctionCallback<?> jsFunc_bjs2 = jsReferences_bjs3 -> {',
            '                    jsReferences_bjs3 = bjs.ensureArraySize(jsReferences_bjs3, 0);',
            '                    nativeFunc_bjs1.apply();',
            '                    return bjs.jsUndefined();',
            '                };',
            '                return bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2);',
            '            };',
            '        }',
            ...expectedFooter)
    })
})