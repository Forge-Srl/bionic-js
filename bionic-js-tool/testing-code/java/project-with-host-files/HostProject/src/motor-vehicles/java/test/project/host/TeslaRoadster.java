package test.project.host;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsAnyObject;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import test.project.host.libs.MotorVehicle;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "TeslaRoadster")
public class TeslaRoadster extends MotorVehicle {
    
    protected <T extends MotorVehicle> TeslaRoadster(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends MotorVehicle> TeslaRoadster(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public TeslaRoadster(JSReference jsObject) {
        this(TeslaRoadster.class, jsObject);
    }
    
    public static TeslaRoadster $default$() {
        return bjs.getObj(bjs.getProperty(bjsClass, "default"), TeslaRoadster.bjsFactory, TeslaRoadster.class);
    }
    
    public BjsAnyObject serialized() {
        return bjs.getAny(bjsGetProperty("serialized"));
    }
    
    public Boolean canTravelInTheSpace() {
        return bjs.getBoolean(bjsGetProperty("canTravelInTheSpace"));
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(TeslaRoadster.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(TeslaRoadster.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<TeslaRoadster> bjsFactory = TeslaRoadster::new;
}