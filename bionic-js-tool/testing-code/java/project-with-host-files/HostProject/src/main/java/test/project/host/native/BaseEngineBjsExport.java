package test.project.host.native;

import bionic.js.Bjs;
import bionic.js.BjsNativeExports;
import bionic.js.BjsNativeWrapper;
import bionic.js.BjsNativeWrapperTypeInfo;
import bionic.js.BjsTypeInfo;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.BjsExport;

public interface BaseEngineBjsExport extends BjsExport {
    
    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();
    
    void powerOn();
    void powerOff();
    void watch(Lambda.F0<String> callback);
    
    @BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "BaseEngine")
    class Wrapper<T extends BaseEngineBjsExport> extends BjsNativeWrapper<T> {
        
        private static Wrapper<?> wrapper;
        private static Wrapper<?> getInstance() {
            if (wrapper == null) {
                wrapper = new Wrapper<>(getClass(BaseEngineBjsExport.class, "BaseEngine"));
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
                .exportFunction("bjs_powerOn", singleton.bjs_powerOn())
                .exportFunction("bjs_powerOff", singleton.bjs_powerOff())
                .exportFunction("bjs_watch", singleton.bjs_watch());
        }
        
        @BjsNativeWrapperTypeInfo.Binder
        public static void bjsBind_(BjsNativeExports nativeExports) {
            nativeExports.exportBindFunction(getInstance().bjsBind());
        }
        
        protected FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                BaseEngineBjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }
        
        protected FunctionCallback<?> bjs_powerOn() {
            return jsReferences -> {
                ((BaseEngineBjsExport) bjs.getWrapped(jsReferences[0])).powerOn();
                return bjs.jsUndefined();
            };
        }
        
        protected FunctionCallback<?> bjs_powerOff() {
            return jsReferences -> {
                ((BaseEngineBjsExport) bjs.getWrapped(jsReferences[0])).powerOff();
                return bjs.jsUndefined();
            };
        }
        
        protected FunctionCallback<?> bjs_watch() {
            return jsReferences -> {
                JSReference jsFunc_bjs0 = jsReferences[1];
                ((BaseEngineBjsExport) bjs.getWrapped(jsReferences[0])).watch(bjs.getFunc(jsFunc_bjs0, () -> {
                    return bjs.getString(bjs.funcCall(jsFunc_bjs0));
                }));
                return bjs.jsUndefined();
            };
        }
    }
}

/* BaseEngine class scaffold:

import test.project.host.native.BaseEngineBjsExport;

public class BaseEngine implements BaseEngineBjsExport {
    
    public void powerOn() {
        
    }
    
    public void powerOff() {
        
    }
    
    public void watch(Lambda.F0<String> callback) {
        
    }
}

*/