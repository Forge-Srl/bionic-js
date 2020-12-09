package acceptance.toy1.bjs;

import bionic.js.Bjs;
import bionic.js.BjsExport;
import bionic.js.BjsNativeExports;
import bionic.js.BjsNativeWrapper;
import bionic.js.BjsNativeWrapperTypeInfo;
import bionic.js.BjsTypeInfo;
import jjbridge.api.value.strategy.FunctionCallback;

public interface ToyComponent1BjsExport extends BjsExport
{
    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();

    Integer number1();
    void number1(Integer value);

    Integer number2();
    void number2(Integer value);

    Integer getSum(Integer offset);
    Integer getToySum(ToyComponent1BjsExport toyComponent1);

    @BjsTypeInfo.BjsLocation(project = "TestProject", module = "ToyComponent1")
    class Wrapper<T extends ToyComponent1BjsExport> extends BjsNativeWrapper<T>
    {
        @BjsNativeWrapperTypeInfo.Exporter
        public static void bjsExportFunctions(BjsNativeExports nativeExports) {
            Wrapper<?> singleton = new Wrapper<>(getClass(ToyComponent1BjsExport.class, "ToyComponent1"));

            nativeExports
                    .exportFunction("bjsStaticGet_pi", singleton.bjsStaticGet_pi())
                    .exportFunction("bjsStatic_sum", singleton.bjsStatic_sum())
                    .exportFunction("bjsGet_number1", singleton.bjsGet_number1())
                    .exportFunction("bjsSet_number1", singleton.bjsSet_number1())
                    .exportFunction("bjsGet_number2", singleton.bjsGet_number2())
                    .exportFunction("bjsSet_number2", singleton.bjsSet_number2())
                    .exportFunction("bjs_getSum", singleton.bjs_getSum())
                    .exportFunction("bjs_getToySum", singleton.bjs_getToySum())
                    .exportBindFunction(singleton.bjsBind());
        }

        protected Wrapper(Class<T> realImplementation)
        {
            super(realImplementation);
        }

        protected FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                ToyComponent1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                if (bound == null) {
                    bound = invokeConstructor(new Class[]{String.class, String.class},
                            new Object[]{bjs.getString(jsReferences[1]), bjs.getString(jsReferences[2])});
                }
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }

        protected FunctionCallback<?> bjsStaticGet_pi() {
            return jsReferences -> bjs.putPrimitive((Double) invokeStatic("PI", new Class[0], new Object[0]));
        }

        protected FunctionCallback<?> bjsStatic_sum() {
            return jsReferences -> {
                Integer result = invokeStatic("sum",
                        new Class[]{Integer.class, Integer.class},
                        new Object[]{bjs.getInteger(jsReferences[0]), bjs.getInteger(jsReferences[0])});
                return bjs.putPrimitive(result);
            };
        }

        protected FunctionCallback<?> bjsGet_number1() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number1());
        }
        protected FunctionCallback<?> bjsSet_number1() {
            return jsReferences -> {
                ((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number1(bjs.getInteger(jsReferences[1]));
                return bjs.jsUndefined();
            };
        }

        protected FunctionCallback<?> bjsGet_number2() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number2());
        }
        protected FunctionCallback<?> bjsSet_number2() {
            return jsReferences -> {
                ((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number2(bjs.getInteger(jsReferences[1]));
                return bjs.jsUndefined();
            };
        }

        protected FunctionCallback<?> bjs_getSum() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).getSum(bjs.getInteger(jsReferences[1])));
        }

        protected FunctionCallback<?> bjs_getToySum() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).getToySum(bjs.getWrapped(jsReferences[1])));
        }
    }
}