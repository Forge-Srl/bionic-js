package test.project.host;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsBeautifulVehicles extends BjsProject {
    
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs) {
        initProject();
        bjs.loadBundle(BjsBeautifulVehicles.class, "Vehicles");
    }
}