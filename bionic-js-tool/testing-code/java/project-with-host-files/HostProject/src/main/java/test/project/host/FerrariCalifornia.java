package test.project.;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "FerrariCalifornia")
public class FerrariCalifornia extends libs.MotorVehicle {
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(FerrariCalifornia.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<FerrariCalifornia> bjsFactory = FerrariCalifornia::new;
}