package acceptance.toy1.bjs;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsTestProject extends BjsProject
{
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs)
    {
        initProject();
        bjs.loadBundle(BjsTestProject.class, "test");
        bjs.addNativeWrapper(ToyComponent1BjsExport.Wrapper.class);
        bjs.addNativeWrapper(ToyComponent2BjsExport.Wrapper.class);
    }
}
