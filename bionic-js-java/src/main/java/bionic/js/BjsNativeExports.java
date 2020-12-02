package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSFunction;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;

public class BjsNativeExports
{
    private static final String nativeObjectName = "bjsNative";
    private final JSRuntime runtime;
    private final JSReference exportsObject;
    private final JSReference nativeObject;

    BjsNativeExports(JSRuntime runtime)
    {
        this.runtime = runtime;
        this.exportsObject = runtime.newReference(JSType.Object);
        this.nativeObject = runtime.newReference(JSType.Object);
        ((JSObject<?>) runtime.resolveReference(this.exportsObject)).set(nativeObjectName, this.nativeObject);
    }

    public JSReference getExportsObject()
    {
        return exportsObject;
    }

    public BjsNativeExports exportBindFunction(FunctionCallback<?> callback)
    {
        return exportFunction("bjsBind", callback);
    }

    public BjsNativeExports exportFunction(String name, FunctionCallback<?> callback)
    {
        JSObject<?> obj = runtime.resolveReference(nativeObject);
        JSReference function = runtime.newReference(JSType.Function);
        JSFunction<?> jsFunction = runtime.resolveReference(function);
        jsFunction.setFunction(callback);
        obj.set(name, function);
        return this;
    }
}
