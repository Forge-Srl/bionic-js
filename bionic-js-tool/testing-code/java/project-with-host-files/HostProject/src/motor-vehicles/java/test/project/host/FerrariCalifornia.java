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

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "FerrariCalifornia")
public class FerrariCalifornia extends MotorVehicle {
    
    protected <T extends MotorVehicle> FerrariCalifornia(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends MotorVehicle> FerrariCalifornia(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public FerrariCalifornia(JSReference jsObject) {
        this(FerrariCalifornia.class, jsObject);
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<FerrariCalifornia> bjsFactory = FerrariCalifornia::new;
}