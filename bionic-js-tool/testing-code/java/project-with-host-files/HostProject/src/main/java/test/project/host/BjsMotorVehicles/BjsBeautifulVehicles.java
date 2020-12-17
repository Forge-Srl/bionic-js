package test.project;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsBeautifulVehicles extends BjsProject {
    
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs) {
        initProject();
        bjs.loadBundle(BjsBeautifulVehicles.class, "MotorVehicles");
        bjs.addNativeWrapper(BaseEngineBjsExport.Wrapper.class);
        bjs.addNativeWrapper(EngineBjsExport.Wrapper.class);
    }
}