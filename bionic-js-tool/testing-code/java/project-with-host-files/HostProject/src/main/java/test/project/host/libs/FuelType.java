package test.project.libs;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.BjsObject;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "FuelType")
public class FuelType extends BjsObject {
    
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