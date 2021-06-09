package test.project.host.$native$;

import bionic.js.Bjs;
import bionic.js.BjsAnyObject;
import bionic.js.BjsNativeExports;
import bionic.js.BjsNativeWrapper;
import bionic.js.BjsNativeWrapperTypeInfo;
import bionic.js.BjsTypeInfo;
import bionic.js.Lambda;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import java.util.Date;
import test.project.host.libs.FuelType;
import test.project.host.$native$.BaseEngineBjsExport;

public interface EngineBjsExport extends BaseEngineBjsExport {
    
    Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();
    
    FuelType fuelType();
    
    @BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "Engine")
    class Wrapper<T extends EngineBjsExport> extends BaseEngineBjsExport.Wrapper<T> {
        
        private static Wrapper<?> wrapper;
        private static Wrapper<?> getInstance() {
            if (wrapper == null) {
                wrapper = new Wrapper<>(getClass(EngineBjsExport.class, "test.project.$native$.Engine"));
            }
            return wrapper;
        }
        
        protected Wrapper(Class<T> realImplementation) {
            super(realImplementation);
        }
        
        @BjsNativeWrapperTypeInfo.Exporter
        public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {
            Wrapper<?> singleton = getInstance();
            return BaseEngineBjsExport.Wrapper.bjsExportFunctions(nativeExports)
                .exportFunction("bjsGet_fuelType", singleton.bjsGet_fuelType());
        }
        
        @BjsNativeWrapperTypeInfo.Binder
        public static void bjsBind_(BjsNativeExports nativeExports) {
            nativeExports.exportBindFunction(getInstance().bjsBind());
        }
        
        protected FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                jsReferences = bjs.ensureArraySize(jsReferences, 2);
                EngineBjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                if (bound == null) {
                    bound = invokeConstructor(new Class[]{FuelType.class}, new Object[]{bjs.getObj(jsReferences[1], FuelType.bjsFactory, FuelType.class)});
                }
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }
        
        protected FunctionCallback<?> bjsGet_fuelType() {
            return jsReferences -> {
                return bjs.putObj(((EngineBjsExport) bjs.getWrapped(jsReferences[0])).fuelType());
            };
        }
    }
}

/* Engine class scaffold:

import test.project.host.$native$.EngineBjsExport;

public class Engine extends BaseEngine implements EngineBjsExport {
    
    public Engine(FuelType fuelType) {
        
    }
    
    public FuelType fuelType() {
        
    }
}

*/