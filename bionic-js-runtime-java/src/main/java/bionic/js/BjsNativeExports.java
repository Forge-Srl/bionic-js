package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSFunction;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;

/**
 * A utility class to export native functions to JavaScript.
 * */
public class BjsNativeExports
{
    private static final String NATIVE_OBJECT_NAME = "bjsNative";
    private static final String NATIVE_BIND_FUNCTION_NAME = "bjsBind";
    private final JSRuntime runtime;
    private final JSReference exportsObject;
    private final JSReference nativeObject;

    BjsNativeExports(JSRuntime runtime)
    {
        this.runtime = runtime;
        this.exportsObject = runtime.newReference(JSType.Object);
        this.nativeObject = runtime.newReference(JSType.Object);
        ((JSObject<?>) runtime.resolveReference(this.exportsObject)).set(NATIVE_OBJECT_NAME, this.nativeObject);
    }

    JSReference getExportsObject()
    {
        return exportsObject;
    }

    /**
     * Exports the native bind function to JavaScript.
     *
     * @param callback the implementation of the function
     * @return `this` for concatenation
     * */
    public BjsNativeExports exportBindFunction(FunctionCallback<?> callback)
    {
        return exportFunction(NATIVE_BIND_FUNCTION_NAME, callback);
    }

    /**
     * Exports a native function with the given name to JavaScript.
     *
     * @param name the JavaScript name of the function
     * @param callback the implementation of the function
     * @return `this` for concatenation
     * */
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
