package test.project.;

import jjbridge.api.runtime.JSReference;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;

@BjsTypeInfo.BjsLocation(project = "BeautifulVehicles", module = "Bicycle")
public class Bicycle extends libs.Vehicle {
    
    public void ride() {
        bjsCall("ride");
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(Bicycle.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(Bicycle.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<Bicycle> bjsFactory = Bicycle::new;
}