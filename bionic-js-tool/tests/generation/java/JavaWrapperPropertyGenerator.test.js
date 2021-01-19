const t = require('../../test-utils')

describe('JavaWrapperPropertyGenerator', () => {

    let Class, Property, Parameter, JsClassType, JsRefType, ArrayType, BoolType, DateType, FloatType,
        IntType, LambdaType, NativeRefType, StringType, VoidType, NativeClassType

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
        NativeRefType = t.requireModule('schema/types/NativeRefType').NativeRefType
    })

    function getCode(propertyType, isPropertyStatic = false, propertyKinds = ['get', 'set']) {
        const class1 = new Class('Class1', '', [], [new Property('property1', 'property description', isPropertyStatic,
            propertyType, propertyKinds)], [], null, true, 'wrapper/Class1')
        return class1.generator.forWrapping(undefined, 'Project1', 'test.java', 'nativePack', [
            {name: 'ClassName', relativePath: 'other/ClassName.js'}
            ]).java.getSource()
    }

    function getFunctionsExportCode(functionsExports = []) {
        return [
            '    @BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
            `    class Wrapper<T extends Class1BjsExport> extends BjsNativeWrapper<T> {`,
            '        ',
            '        private static Wrapper<?> wrapper;',
            '        private static Wrapper<?> getInstance() {',
            '            if (wrapper == null) {',
            '                wrapper = new Wrapper<>(getClass(Class1BjsExport.class, "nativePack.Class1"));',
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
            ...functionsExports.map((code, index) => `                ${code}${index === functionsExports.length-1 ? ';' : ''}`),
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

    const expectedHeader = (additionalImports = []) => [
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
        ...additionalImports,
        'import bionic.js.BjsExport;',
        '',
        'public interface Class1BjsExport extends BjsExport {',
        '    ',
        '    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();',
        '    ',
    ]

    const expectedFooter = [
        '    }',
        '}']

    test('IntType, only getter, static', () => {
        const code = getCode(new IntType(), true, ['get'])

        t.expectCode(code,
            ...expectedHeader(),
            ...getFunctionsExportCode(['.exportFunction("bjsStaticGet_property1", singleton.bjsStaticGet_property1())']),
            '        ',
            '        protected FunctionCallback<?> bjsStaticGet_property1() {',
            '            return jsReferences -> {',
            '                Integer result_bjs0 = invokeStatic("property1", new Class[]{}, new Object[]{});',
            '                return bjs.putPrimitive(result_bjs0);',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('IntType, only setter, static', () => {
        const code = getCode(new IntType(), true, ['set'])

        t.expectCode(code,
            ...expectedHeader(),
            ...getFunctionsExportCode(['.exportFunction("bjsStaticSet_property1", singleton.bjsStaticSet_property1())']),
            '        ',
            '        protected FunctionCallback<?> bjsStaticSet_property1() {',
            '            return jsReferences -> {',
            '                invokeStatic("property1", new Class[]{Integer.class}, new Object[]{bjs.getInteger(jsReferences[0])});',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('IntType, static', () => {
        const code = getCode(new IntType(), true)

        t.expectCode(code,
            ...expectedHeader(),
            ...getFunctionsExportCode([
                '.exportFunction("bjsStaticGet_property1", singleton.bjsStaticGet_property1())',
                '.exportFunction("bjsStaticSet_property1", singleton.bjsStaticSet_property1())',
            ]),
            '        ',
            '        protected FunctionCallback<?> bjsStaticGet_property1() {',
            '            return jsReferences -> {',
            '                Integer result_bjs0 = invokeStatic("property1", new Class[]{}, new Object[]{});',
            '                return bjs.putPrimitive(result_bjs0);',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsStaticSet_property1() {',
            '            return jsReferences -> {',
            '                invokeStatic("property1", new Class[]{Integer.class}, new Object[]{bjs.getInteger(jsReferences[0])});',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    const getterAndSetterFunctionsExportCode = getFunctionsExportCode([
        '.exportFunction("bjsGet_property1", singleton.bjsGet_property1())',
        '.exportFunction("bjsSet_property1", singleton.bjsSet_property1())',
    ])

    test('JsRefType', () => {
        const code = getCode(new JsRefType())

        t.expectCode(code,
            ...expectedHeader(),
            '    BjsAnyObject property1();',
            '    void property1(BjsAnyObject value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1().jsObj;',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getAny(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('ArrayType', () => {
        const code = getCode(new ArrayType(new ArrayType(new IntType())))

        t.expectCode(code,
            ...expectedHeader(),
            '    Integer[][] property1();',
            '    void property1(Integer[][] value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putArray(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(), nv_bjs0 -> {',
            '                    return bjs.putArray(nv_bjs0, nv_bjs1 -> {',
            '                        return bjs.putPrimitive(nv_bjs1);',
            '                    });',
            '                });',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getArray(jsReferences[1], r_bjs0 -> {',
            '                    return bjs.getArray(r_bjs0, r_bjs1 -> {',
            '                        return bjs.getInteger(r_bjs1);',
            '                    }, Integer.class);',
            '                }, Integer[].class));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('BoolType', () => {
        const code = getCode(new BoolType())

        t.expectCode(code,
            ...expectedHeader(),
            '    Boolean property1();',
            '    void property1(Boolean value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putPrimitive(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1());',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getBoolean(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('DateType', () => {
        const code = getCode(new DateType())

        t.expectCode(code,
            ...expectedHeader(),
            '    Date property1();',
            '    void property1(Date value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putPrimitive(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1());',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getDate(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('FloatType', () => {
        const code = getCode(new FloatType())

        t.expectCode(code,
            ...expectedHeader(),
            '    Double property1();',
            '    void property1(Double value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putPrimitive(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1());',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getDouble(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('LambdaType', () => {
        const voidLambda = new LambdaType(new VoidType(), [])
        const voidLambdaParam = new Parameter(voidLambda, 'voidLambda', 'void lambda description')
        const code = getCode(new LambdaType(voidLambda, [voidLambdaParam]))

        t.expectCode(code,
            ...expectedHeader(),
            '    Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> property1();',
            '    void property1(Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                Lambda.F1<Lambda.F0<Void>, Lambda.F0<Void>> nativeFunc_bjs0 = ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1();',
            '                FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {',
            '                    jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 1);',
            '                    JSReference jsFunc_bjs3 = jsReferences_bjs2[0];',
            '                    Lambda.F0<Void> nativeFunc_bjs4 = nativeFunc_bjs0.apply(bjs.getFunc(jsFunc_bjs3, () -> {',
            '                        bjs.funcCall(jsFunc_bjs3);',
            '                        return null;',
            '                    }));',
            '                    FunctionCallback<?> jsFunc_bjs5 = jsReferences_bjs6 -> {',
            '                        jsReferences_bjs6 = bjs.ensureArraySize(jsReferences_bjs6, 0);',
            '                        nativeFunc_bjs4.apply();',
            '                        return bjs.jsUndefined();',
            '                    };',
            '                    return bjs.putFunc(nativeFunc_bjs4, jsFunc_bjs5);',
            '                };',
            '                return bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1);',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                JSReference jsFunc_bjs0 = jsReferences[1];',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getFunc(jsFunc_bjs0, (jsFunc_bjs0_v0) -> {',
            '                    Lambda.F0<Void> nativeFunc_bjs1 = jsFunc_bjs0_v0;',
            '                    FunctionCallback<?> jsFunc_bjs2 = jsReferences_bjs3 -> {',
            '                        jsReferences_bjs3 = bjs.ensureArraySize(jsReferences_bjs3, 0);',
            '                        nativeFunc_bjs1.apply();',
            '                        return bjs.jsUndefined();',
            '                    };',
            '                    JSReference jsFunc_bjs4 = bjs.funcCall(jsFunc_bjs0, bjs.putFunc(nativeFunc_bjs1, jsFunc_bjs2));',
            '                    return bjs.getFunc(jsFunc_bjs4, () -> {',
            '                        bjs.funcCall(jsFunc_bjs4);',
            '                        return null;',
            '                    });',
            '                }));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('JsClassType', () => {
        const code = getCode(new JsClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader(['import test.java.other.ClassName;']),
            '    ClassName property1();',
            '    void property1(ClassName value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putObj(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1());',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getObj(jsReferences[1], ClassName.bjsFactory, ClassName.class));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('StringType', () => {
        const code = getCode(new StringType())

        t.expectCode(code,
            ...expectedHeader(),
            '    String property1();',
            '    void property1(String value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putPrimitive(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1());',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getString(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('NativeClassType', () => {
        const code = getCode(new NativeClassType('ClassName'))

        t.expectCode(code,
            ...expectedHeader(['import test.java.other.ClassNameBjsExport;']),
            '    ClassNameBjsExport property1();',
            '    void property1(ClassNameBjsExport value);',
            '    ',
            ...getterAndSetterFunctionsExportCode,
            '        ',
            '        protected FunctionCallback<?> bjsGet_property1() {',
            '            return jsReferences -> {',
            '                return bjs.putWrapped(((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(), ClassNameBjsExport.Wrapper.class);',
            '            };',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsSet_property1() {',
            '            return jsReferences -> {',
            '                ((Class1BjsExport) bjs.getWrapped(jsReferences[0])).property1(bjs.getWrapped(jsReferences[1]));',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })
})