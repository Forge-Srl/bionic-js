const t = require('../../test-utils')

describe('JavaWrapperConstructorGenerator', () => {

    let Class, Constructor, Parameter, VoidType, BoolType, IntType, ArrayType, LambdaType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Parameter = t.requireModule('schema/Parameter').Parameter
        BoolType = t.requireModule('schema/types/BoolType').BoolType
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    function getCode(constructorParameters, superclass = null) {
        const class1 = new Class('Class1', '', [new Constructor('constructor description', constructorParameters)], [], [], superclass, true, 'wrapper/Class1')
        return class1.generator.forWrapping(undefined, 'Project1', 'test.java', 'nativePack').java.getSource()
    }

    function newParam(type, name) {
        return new Parameter(type, name, 'parameter description')
    }

    const exportFunctionsCode = [
        '        @BjsNativeWrapperTypeInfo.Exporter',
        '        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {',
        '            return nativeExports;',
        '        }',
        '        ',
    ]

    const exportFunctionsCodeWithInheritance = [
        '        @BjsNativeWrapperTypeInfo.Exporter',
        '        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {',
        '            return SuperclassBjsExport.Wrapper.bjsExportFunctions(nativeExports);',
        '        }',
        '        ',
    ]

    const getExpectedHeader = (superclassName = '') => [
        'package test.java.wrapper;',
        '',
        'import bionic.js.Bjs;',
        'import bionic.js.BjsAnyObject;',
        'import bionic.js.BjsNativeExports;',
        'import bionic.js.BjsNativeWrapper;',
        'import bionic.js.BjsNativeWrapperTypeInfo;',
        'import bionic.js.BjsTypeInfo;',
        'import bionic.js.Lambda;',
        'import jjbridge.api.runtime.JSReference;',
        'import jjbridge.api.value.strategy.FunctionCallback;',
        'import java.util.Date;',
        `import ${superclassName ? `test.java.wrapper.${superclassName}BjsExport` : 'bionic.js.BjsExport'};`,
        '',
        `public interface Class1BjsExport extends ${superclassName}BjsExport {`,
        '    ',
        '    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();',
        '    ',
    ]

    const getExpectedWrapperHeader = (superclassName = 'BjsNativeWrapper') => [
        '    @BjsTypeInfo.BjsLocation(project = "Project1", module = "Class1")',
        `    class Wrapper<T extends Class1BjsExport> extends ${superclassName}<T> {`,
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
    ]

    const expectedFooter = [
        '    }',
        '}']

    test('no params', () => {
        const code = getCode([])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                jsReferences = bjs.ensureArraySize(jsReferences, 2);',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                if (bound == null) {',
            '                    bound = invokeConstructor(new Class[]{}, new Object[]{});',
            '                }',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('no public constructor', () => {
        const code = new Class('Class1', '', [], [], [], null, true, 'wrapper/Class1')
            .generator.forWrapping(undefined, 'Project1', 'test.java', 'nativePack').java.getSource()

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                jsReferences = bjs.ensureArraySize(jsReferences, 2);',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    const publicConstructorWithIntParamBindCode = [
        '        @BjsNativeWrapperTypeInfo.Binder',
        '        public static void bjsBind_(BjsNativeExports nativeExports) {',
        '            nativeExports.exportBindFunction(getInstance().bjsBind());',
        '        }',
        '        ',
        '        protected FunctionCallback<?> bjsBind() {',
        '            return jsReferences -> {',
        '                jsReferences = bjs.ensureArraySize(jsReferences, 2);',
        '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
        '                if (bound == null) {',
        '                    bound = invokeConstructor(new Class[]{Integer.class}, new Object[]{bjs.getInteger(jsReferences[1])});',
        '                }',
        '                bjs.bindNative(bound, jsReferences[0]);',
        '                return bjs.jsUndefined();',
        '            };',
        '        }',
    ]

    test('no public constructor, inherited public constructor', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const superclass = new Class('Superclass', '', [new Constructor('', [intPar])], [], [], null, true, 'wrapper/Superclass')
        const code = new Class('Class1', '', [], [], [], superclass, true, 'wrapper/Class1')
            .generator.forWrapping(undefined, 'Project1', 'test.java', 'nativePack').java.getSource()

        t.expectCode(code,
            ...getExpectedHeader('Superclass'),
            ...getExpectedWrapperHeader('SuperclassBjsExport.Wrapper'),
            ...exportFunctionsCodeWithInheritance,
            ...publicConstructorWithIntParamBindCode,
            ...expectedFooter)
    })

    test('no public constructor, inherited public constructor from superSuperclass', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const superSuperclass = new Class('SuperSuperclass', '', [new Constructor('', [intPar])], [], [], null, true, 'wrapper/SuperSuperclass')
        const superclass = new Class('Superclass', '', [], [], [], superSuperclass, true, 'wrapper/Superclass')
        const code = new Class('Class1', '', [], [], [], superclass, true, 'wrapper/Class1')
            .generator.forWrapping(undefined, 'Project1', 'test.java', 'nativePack').java.getSource()

        t.expectCode(code,
            ...getExpectedHeader('Superclass'),
            ...getExpectedWrapperHeader('SuperclassBjsExport.Wrapper'),
            ...exportFunctionsCodeWithInheritance,
            ...publicConstructorWithIntParamBindCode,
            ...expectedFooter)
    })

    test('single primitive, no inherited public constructor', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const code = getCode([intPar])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            ...publicConstructorWithIntParamBindCode,
            ...expectedFooter)
    })

    test('single primitive, inherited public constructor with different signature', () => {
        const intPar = newParam(new IntType(), 'intParam')
        const boolPar = newParam(new BoolType(), 'boolParam')
        const superSuperclass = new Class('SuperSuperclass', '', [new Constructor('', [boolPar])], [], [], null, true, 'wrapper/SuperSuperclass')
        const superclass = new Class('Superclass', '', [new Constructor('constructor description', [boolPar, intPar])], [], [], superSuperclass, true, 'wrapper/Superclass')
        const code = getCode([intPar], superclass)

        t.expectCode(code,
            ...getExpectedHeader('Superclass'),
            ...getExpectedWrapperHeader('SuperclassBjsExport.Wrapper'),
            ...exportFunctionsCodeWithInheritance,
            ...publicConstructorWithIntParamBindCode,
            ...expectedFooter)
    })

    test('multiple primitives', () => {
        const boolPar = newParam(new BoolType(), 'boolParam')
        const intPar = newParam(new IntType(), 'intParam')

        const code = getCode([boolPar, intPar])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                jsReferences = bjs.ensureArraySize(jsReferences, 3);',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                if (bound == null) {',
            '                    bound = invokeConstructor(new Class[]{Boolean.class, Integer.class}, new Object[]{bjs.getBoolean(jsReferences[1]), bjs.getInteger(jsReferences[2])});',
            '                }',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('void lambda', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')

        const code = getCode([voidLambdaParam])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                jsReferences = bjs.ensureArraySize(jsReferences, 2);',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                if (bound == null) {',
            '                    JSReference jsFunc_bjs0 = jsReferences[1];',
            '                    bound = invokeConstructor(new Class[]{Lambda.F0.class}, new Object[]{bjs.getFunc(jsFunc_bjs0, (Lambda.F0<Void>) () -> {',
            '                        bjs.funcCall(jsFunc_bjs0);',
            '                        return null;',
            '                    })});',
            '                }',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })

    test('void lambda, lambda returning primitive, primitive', () => {
        const voidLambdaParam = newParam(new LambdaType(new VoidType(), []), 'voidNativeFunc')
        const intLambdaParam = newParam(new LambdaType(new IntType(), []), 'intNativeFunc')
        const arrayLambdaParam = newParam(new LambdaType(new ArrayType(new IntType()), []), 'arrayNativeFunc')
        const intParam = newParam(new IntType(), 'intPar')

        const code = getCode([voidLambdaParam, intLambdaParam, arrayLambdaParam, intParam])

        t.expectCode(code,
            ...getExpectedHeader(),
            ...getExpectedWrapperHeader(),
            ...exportFunctionsCode,
            '        @BjsNativeWrapperTypeInfo.Binder',
            '        public static void bjsBind_(BjsNativeExports nativeExports) {',
            '            nativeExports.exportBindFunction(getInstance().bjsBind());',
            '        }',
            '        ',
            '        protected FunctionCallback<?> bjsBind() {',
            '            return jsReferences -> {',
            '                jsReferences = bjs.ensureArraySize(jsReferences, 5);',
            '                Class1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);',
            '                if (bound == null) {',
            '                    JSReference jsFunc_bjs0 = jsReferences[1];',
            '                    JSReference jsFunc_bjs1 = jsReferences[2];',
            '                    JSReference jsFunc_bjs2 = jsReferences[3];',
            '                    bound = invokeConstructor(new Class[]{Lambda.F0.class, Lambda.F0.class, Lambda.F0.class, Integer.class}, new Object[]{bjs.getFunc(jsFunc_bjs0, (Lambda.F0<Void>) () -> {',
            '                        bjs.funcCall(jsFunc_bjs0);',
            '                        return null;',
            '                    }), bjs.getFunc(jsFunc_bjs1, (Lambda.F0<Integer>) () -> {',
            '                        return bjs.getInteger(bjs.funcCall(jsFunc_bjs1));',
            '                    }), bjs.getFunc(jsFunc_bjs2, (Lambda.F0<Integer[]>) () -> {',
            '                        return bjs.getArray(bjs.funcCall(jsFunc_bjs2), r_bjs3 -> {',
            '                            return bjs.getInteger(r_bjs3);',
            '                        }, Integer.class);',
            '                    }), bjs.getInteger(jsReferences[4])});',
            '                }',
            '                bjs.bindNative(bound, jsReferences[0]);',
            '                return bjs.jsUndefined();',
            '            };',
            '        }',
            ...expectedFooter)
    })
})