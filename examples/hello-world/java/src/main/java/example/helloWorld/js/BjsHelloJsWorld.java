package example.helloWorld.js;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsHelloJsWorld extends BjsProject {
    
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs) {
        initProject();
        bjs.loadBundle(BjsHelloJsWorld.class, "MainBundle");
        bjs.addNativeWrapper(example.helloWorld.js.HelloNativeWorldBjsExport.Wrapper.class);
    }
}