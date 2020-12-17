package test.project.libs;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.BjsObject;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "Vehicle")
public class Vehicle extends BjsObject {
    
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