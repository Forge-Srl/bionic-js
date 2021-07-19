package test.project.host.libs;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsAnyObject;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import test.project.host.$native$.EngineBjsExport;
import test.project.host.libs.FuelType;
import test.project.host.libs.Vehicle;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "MotorVehicle")
public class MotorVehicle extends Vehicle {
    
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
    
    public MotorVehicle(Long weight, Long seats, Long maxSpeed, FuelType fuelType, Double maxRange, Double currentRange) {
        this(bjs_MotorVehicle(weight, seats, maxSpeed, fuelType, maxRange, currentRange));
    }
    
    private static JSReference[] bjs_MotorVehicle(Long weight, Long seats, Long maxSpeed, FuelType fuelType, Double maxRange, Double currentRange) {
        return new JSReference[]{bjs.putPrimitive(weight), bjs.putPrimitive(seats), bjs.putPrimitive(maxSpeed), bjs.putObj(fuelType), bjs.putPrimitive(maxRange), bjs.putPrimitive(currentRange)};
    }
    
    public Boolean isOnReserve() {
        return bjs.getBoolean(bjsGetProperty("isOnReserve"));
    }
    
    public EngineBjsExport engine() {
        return bjs.getWrapped(bjsGetProperty("engine"));
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