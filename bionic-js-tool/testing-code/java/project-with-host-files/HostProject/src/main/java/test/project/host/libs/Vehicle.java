package test.project.host.libs;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import bionic.js.BjsObject;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "Vehicle")
public class Vehicle extends BjsObject {
    
    protected <T extends BjsObject> Vehicle(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends BjsObject> Vehicle(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public Vehicle(JSReference jsObject) {
        this(Vehicle.class, jsObject);
    }
    
    public String description() {
        return bjs.getString(bjsGetProperty("description"));
    }
    
    public Double weight() {
        return bjs.getDouble(bjsGetProperty("weight"));
    }
    public void weight(Double value) {
        bjsSetProperty("weight", bjs.putPrimitive(value));
    }
    
    public Integer seats() {
        return bjs.getInteger(bjsGetProperty("seats"));
    }
    
    public Integer maxSpeed() {
        return bjs.getInteger(bjsGetProperty("maxSpeed"));
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Vehicle.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(Vehicle.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<Vehicle> bjsFactory = Vehicle::new;
}