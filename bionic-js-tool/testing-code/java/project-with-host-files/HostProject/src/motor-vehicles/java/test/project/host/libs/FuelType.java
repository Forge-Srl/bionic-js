package test.project.host.libs;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import bionic.js.BjsObject;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "FuelType")
public class FuelType extends BjsObject {
    
    protected <T extends BjsObject> FuelType(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends BjsObject> FuelType(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public FuelType(JSReference jsObject) {
        this(FuelType.class, jsObject);
    }
    
    public static FuelType Electricity() {
        return bjs.getObj(bjs.getProperty(bjsClass, "Electricity"), FuelType.bjsFactory, FuelType.class);
    }
    
    public static FuelType NaturalGas() {
        return bjs.getObj(bjs.getProperty(bjsClass, "NaturalGas"), FuelType.bjsFactory, FuelType.class);
    }
    
    public static FuelType Diesel() {
        return bjs.getObj(bjs.getProperty(bjsClass, "Diesel"), FuelType.bjsFactory, FuelType.class);
    }
    
    public static FuelType Petrol() {
        return bjs.getObj(bjs.getProperty(bjsClass, "Petrol"), FuelType.bjsFactory, FuelType.class);
    }
    
    public static FuelType Kerosene() {
        return bjs.getObj(bjs.getProperty(bjsClass, "Kerosene"), FuelType.bjsFactory, FuelType.class);
    }
    
    public String name() {
        return bjs.getString(bjsGetProperty("name"));
    }
    
    public Double cost() {
        return bjs.getDouble(bjsGetProperty("cost"));
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(FuelType.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(FuelType.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<FuelType> bjsFactory = FuelType::new;
}