package example.helloWorld.js;

import bionic.js.Bjs;
import bionic.js.BjsNativeExports;
import bionic.js.BjsNativeWrapper;
import bionic.js.BjsNativeWrapperTypeInfo;
import bionic.js.BjsTypeInfo;
import bionic.js.Lambda;
import jjbridge.api.value.strategy.FunctionCallback;
import java.util.Date;
import bionic.js.BjsExport;

public interface HelloNativeWorldBjsExport extends BjsExport {
    
    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();
    
    @BjsTypeInfo.BjsLocation(project = "HelloJsWorld", module = "HelloNativeWorld")
    class Wrapper<T extends HelloNativeWorldBjsExport> extends BjsNativeWrapper<T> {
        
        private static Wrapper<?> wrapper;
        private static Wrapper<?> getInstance() {
            if (wrapper == null) {
                wrapper = new Wrapper<>(getClass(HelloNativeWorldBjsExport.class, "HelloNativeWorld"));
            }
            return wrapper;
        }
        
        protected Wrapper(Class<T> realImplementation) {
            super(realImplementation);
        }
        
        @BjsNativeWrapperTypeInfo.Exporter
        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {
            Wrapper<?> singleton = getInstance();
            return nativeExports
                .exportFunction("bjsStaticGet_hello", singleton.bjsStaticGet_hello());
        }
        
        @BjsNativeWrapperTypeInfo.Binder
        public static void bjsBind_(BjsNativeExports nativeExports) {
            nativeExports.exportBindFunction(getInstance().bjsBind());
        }
        
        protected FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                HelloNativeWorldBjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }
        
        protected FunctionCallback<?> bjsStaticGet_hello() {
            return jsReferences -> {
                String result_bjs0 = invokeStatic("hello", new Class[]{}, new Object[]{});
                return bjs.putPrimitive(result_bjs0);
            };
        }
    }
}

/* HelloNativeWorld class scaffold:

import example.helloWorld.js.HelloNativeWorldBjsExport;

public class HelloNativeWorld implements HelloNativeWorldBjsExport {
    
    public static String hello() {
        
    }
}

*/