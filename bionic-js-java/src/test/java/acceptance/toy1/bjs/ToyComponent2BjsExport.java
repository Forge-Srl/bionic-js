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
        private static Wrapper<?> wrapper;
        private static Wrapper<?> getInstance()
        {
            if (wrapper == null)
            {
                wrapper = new Wrapper<>(getClass(ToyComponent2BjsExport.class, "acceptance.toy1.components.ToyComponent2"));
            }
            return wrapper;
        }

        @BjsNativeWrapperTypeInfo.Exporter
        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {
            Wrapper<?> singleton = getInstance();

            return ToyComponent1BjsExport.Wrapper.bjsExportFunctions(nativeExports)
                    .exportFunction("bjs_additionalMethod", singleton.bjs_additionalMethod());
        }

        @BjsNativeWrapperTypeInfo.Binder
        public static void bjsBind_(BjsNativeExports nativeExports) {
            nativeExports.exportBindFunction(getInstance().bjsBind());
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