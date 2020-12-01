package acceptance.toy1;

import bionic.js.Bjs;
import bionic.js.BjsProject;
import bionic.js.BjsProjectTypeInfo;

public class BjsTestProject extends BjsProject
{
    @BjsProjectTypeInfo.Initializer
    public static void initialize(Bjs bjs)
    {
        bjs.loadBundle(BjsTestProject.class, "test");
    }
}
