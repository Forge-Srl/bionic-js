package test.project.libs;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "MotorVehicle")
public class MotorVehicle extends libs.Vehicle {
    
    protected <T extends Vehicle> MotorVehicle(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends Vehicle> MotorVehicle(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public MotorVehicle(JSReference jsObject) {
        this(MotorVehicle.class, jsObject);
    }
    
    public MotorVehicle(JSReference[] arguments) {
        this(MotorVehicle.class, arguments);
    }
    
    public MotorVehicle(Integer weight, Integer seats, Integer maxSpeed, FuelType fuelType, Double maxRange, Double currentRange) {
        this(bjs_MotorVehicle(weight, seats, maxSpeed, fuelType, maxRange, currentRange));
    }
    
    private static JSReference[] bjs_MotorVehicle(Integer weight, Integer seats, Integer maxSpeed, FuelType fuelType, Double maxRange, Double currentRange) {
        return new JSReference[]{bjs.putPrimitive(weight), bjs.putPrimitive(seats), bjs.putPrimitive(maxSpeed), bjs.putObj(fuelType), bjs.putPrimitive(maxRange), bjs.putPrimitive(currentRange)};
    }
    
    public Boolean isOnReserve() {
        return bjs.getBoolean(bjsGetProperty("isOnReserve"));
    }
    
    public EngineBjsExport engine() {
        return bjs.getWrapped(bjsGetProperty("engine"));
    }
    
    public Engine rawEngine() {
        return bjs.getNative(bjsGetProperty("rawEngine"));
    }
    
    public AppDelegate delegate() {
        return bjs.getNative(bjsGetProperty("delegate"));
    }
    
    public Double refuel() {
        return bjs.getDouble(bjsCall("refuel"));
    }
    
    public void watchEngine(Lambda.F0<String> observer) {
        Lambda.F0<String> nativeFunc_bjs0 = observer;
        FunctionCallback<?> jsFunc_bjs1 = jsReferences_bjs2 -> {
            jsReferences_bjs2 = bjs.ensureArraySize(jsReferences_bjs2, 0);
            return bjs.putPrimitive(nativeFunc_bjs0.apply());
        };
        bjsCall("watchEngine", bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1));
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(MotorVehicle.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(MotorVehicle.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<MotorVehicle> bjsFactory = MotorVehicle::new;
}