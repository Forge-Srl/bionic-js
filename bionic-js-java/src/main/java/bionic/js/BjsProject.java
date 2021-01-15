package bionic.js;

import jjbridge.api.JSEngine;
import jjbridge.api.runtime.JSRuntime;

/**
 * This class represents a Bjs project bundle.
 * <p>A subclass of this type, must conform to the following constrains:</p>
 * <ul>
 *     <li>Its name must begin with "{@code Bjs}";</li>
 *     <li>Have a static method annotated with {@link BjsProjectTypeInfo.BjsProjectInitializer};</li>
 *     <li>That method must call {@link #initProject()} as first instruction.</li>
 * </ul>
 * */
public class BjsProject
{
    private static JSEngine jsEngine;

    /**
     * Sets the JavaScript engine instance that will be used to run JavaScript code.
     * */
    public static void setJsEngine(JSEngine engine)
    {
        jsEngine = engine;
    }

    protected static void initProject()
    {
        if (jsEngine == null)
        {
            throw new RuntimeException("Global jsEngine for BjsProject is null.\n"
                    + "Please call BjsProject.setJsEngine() to set the engine.");
        }
        JSRuntime runtime = jsEngine.newRuntime();
        Bjs.setDefaultRuntime(runtime);
    }
}
