package acceptance.toy1.bjs;

import bionic.js.Bjs;
import bionic.js.BjsNativeExports;
import bionic.js.BjsNativeWrapperTypeInfo;
import bionic.js.BjsTypeInfo;
import jjbridge.api.value.strategy.FunctionCallback;

public interface ToyComponent2BjsExport extends ToyComponent1BjsExport
{
    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();

    Integer additionalMethod();

    @BjsTypeInfo.BjsLocation(project = "TestProject", module = "ToyComponent2")
    class Wrapper<T extends ToyComponent2BjsExport> extends ToyComponent1BjsExport.Wrapper<T>
    {
        @BjsNativeWrapperTypeInfo.Exporter
        public static void bjsExportFunctions(BjsNativeExports nativeExports) {
            Wrapper<?> singleton = new Wrapper<>(getClass(ToyComponent2BjsExport.class, "ToyComponent2"));

            nativeExports
                    .exportFunction("bjsStaticGet_pi", singleton.bjsStaticGet_pi())
                    .exportFunction("bjsStatic_sum", singleton.bjsStatic_sum())
                    .exportFunction("bjsGet_number1", singleton.bjsGet_number1())
                    .exportFunction("bjsSet_number1", singleton.bjsSet_number1())
                    .exportFunction("bjsGet_number2", singleton.bjsGet_number2())
                    .exportFunction("bjsSet_number2", singleton.bjsSet_number2())
                    .exportFunction("bjs_getSum", singleton.bjs_getSum())
                    .exportFunction("bjs_getToySum", singleton.bjs_getToySum())
                    .exportFunction("bjs_additionalMethod", singleton.bjs_additionalMethod())
                    .exportBindFunction(singleton.bjsBind());
        }

        protected Wrapper(Class<T> realImplementation)
        {
            super(realImplementation);
        }

        protected FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                ToyComponent2BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                if (bound == null) {
                    bound = invokeConstructor(new Class[]{String.class, String.class},
                            new Object[]{bjs.getString(jsReferences[1]), bjs.getString(jsReferences[2])});
                }
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }

        protected FunctionCallback<?> bjs_additionalMethod() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent2BjsExport) bjs.getWrapped(jsReferences[0])).additionalMethod());
        }
    }
}