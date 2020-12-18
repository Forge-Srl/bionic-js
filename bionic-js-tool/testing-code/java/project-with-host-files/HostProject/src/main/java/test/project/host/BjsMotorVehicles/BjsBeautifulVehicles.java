package test.project.host.BjsMotorVehicles;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsBeautifulVehicles extends BjsProject {
    
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs) {
        initProject();
        bjs.loadBundle(BjsBeautifulVehicles.class, "MotorVehicles");
        bjs.addNativeWrapper(test.project.host.native.BaseEngineBjsExport.Wrapper.class);
        bjs.addNativeWrapper(test.project.host.native.EngineBjsExport.Wrapper.class);
    }
}