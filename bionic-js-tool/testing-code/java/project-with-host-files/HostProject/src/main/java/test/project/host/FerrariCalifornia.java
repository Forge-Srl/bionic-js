package test.project.host;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import test.project.host.libs.MotorVehicle;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "FerrariCalifornia")
public class FerrariCalifornia extends MotorVehicle {
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<FerrariCalifornia> bjsFactory = FerrariCalifornia::new;
}