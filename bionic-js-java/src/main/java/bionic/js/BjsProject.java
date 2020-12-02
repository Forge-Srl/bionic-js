package bionic.js;

import jjbridge.api.JSEngine;
import jjbridge.api.runtime.JSRuntime;

public class BjsProject
{
    private static JSEngine jsEngine;

    public static void setJsEngine(JSEngine engine)
    {
        jsEngine = engine;
    }

    protected static void initProject()
    {
        if (jsEngine == null)
        {
            throw new RuntimeException("Global jsEngine for BjsProject is null.");
        }
        JSRuntime runtime = jsEngine.newRuntime();
        Bjs.setDefaultRuntime(runtime);
    }
}
