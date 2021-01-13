package test.project.host;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import test.project.host.libs.Vehicle;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "Bicycle")
public class Bicycle extends Vehicle {
    
    protected <T extends Vehicle> Bicycle(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends Vehicle> Bicycle(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public Bicycle(JSReference jsObject) {
        this(Bicycle.class, jsObject);
    }
    
    public void ride() {
        bjsCall("ride");
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Bicycle.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(Bicycle.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<Bicycle> bjsFactory = Bicycle::new;
}