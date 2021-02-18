package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSBoolean;
import jjbridge.api.value.JSDate;
import jjbridge.api.value.JSDouble;
import jjbridge.api.value.JSExternal;
import jjbridge.api.value.JSFunction;
import jjbridge.api.value.JSInteger;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSString;
import jjbridge.api.value.JSType;
import jjbridge.api.value.JSValue;
import jjbridge.api.value.strategy.FunctionCallback;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

class BjsContext
{
    private final JSRuntime runtime;
    private final String projectName;
    private final TimeoutHandler timeoutHandler = new TimeoutHandler(0);
    private final Map<String, BjsNativeWrapperTypeInfo<?>> nativeWrappers = new HashMap<>();
    private JSReference moduleLoader;

    protected final FunctionCallback<JSReference> setTimeoutCallback = jsReferences ->
    {
        JSFunction<?> function = resolve(jsReferences[0]);
        int delay = ((JSInteger) resolve(jsReferences[1])).getValue();
        int timeoutId = timeoutHandler.runDelayed(function, jsReferences[0], delay);
        return newInteger(timeoutId);
    };

    protected final FunctionCallback<JSReference> clearTimeoutCallback = jsReferences ->
    {
        int id = ((JSInteger) resolve(jsReferences[0])).getValue();
        timeoutHandler.remove(id);
        return createJsUndefined();
    };

    protected final FunctionCallback<JSReference> bjsNativeRequireCallback = jsReferences ->
    {
        String moduleName = ((JSString) resolve(jsReferences[0])).getValue();
        return getNativeModule(moduleName);
    };

    protected final FunctionCallback<JSReference> bjsSetModuleLoaderCallback = jsReferences ->
    {
        this.moduleLoader = jsReferences[0];
        return createJsUndefined();
    };

    protected static void defineGlobalFunction(JSRuntime runtime, String name, FunctionCallback<JSReference> callback)
    {
        JSReference functionReference = runtime.newReference(JSType.Function);
        JSFunction<?> jsFunction = runtime.resolveReference(functionReference);
        jsFunction.setFunction(callback);
        runtime.globalObject().set(name, functionReference);
    }

    BjsContext(@NonNull JSRuntime runtime, @NonNull String projectName)
    {
        this.runtime = runtime;
        this.projectName = projectName;

        defineGlobalFunction(runtime, "setTimeout", setTimeoutCallback);
        defineGlobalFunction(runtime, "clearTimeout", clearTimeoutCallback);
        defineGlobalFunction(runtime, "bjsNativeRequire", bjsNativeRequireCallback);
        defineGlobalFunction(runtime, "bjsSetModuleLoader", bjsSetModuleLoaderCallback);

        //TODO: add console.log and console.error?

        // Shim for "process" global variable used by Node.js
        JSReference processRef = runtime.newReference(JSType.Object);
        JSObject<?> jsProcess = runtime.resolveReference(processRef);
        jsProcess.set("env", runtime.newReference(JSType.Object));
        runtime.globalObject().set("process", processRef);
    }

    <B extends BjsNativeWrapper<T>, T extends BjsExport> void addNativeWrapper(Class<B> nativeWrapperClass)
    {
        BjsNativeWrapperTypeInfo<B> typeInfo = BjsNativeWrapperTypeInfo.get(nativeWrapperClass);
        BjsLocator bjsLocator = typeInfo.bjsLocator;
        if (bjsLocator.isInvalid())
        {
            throw new RuntimeException("Invalid module locator");
        }

        String wrapperName = bjsLocator.moduleName;
        if (nativeWrappers.containsKey(wrapperName))
        {
            throw new RuntimeException("Native wrapper " + wrapperName + " was already added to this Bjs context");
        }
        nativeWrappers.put(wrapperName, typeInfo);
    }

    JSReference getModule(String moduleName)
    {
        return callFunction(moduleLoader, moduleLoader, newString(moduleName));
    }

    JSReference getNativeModule(String nativeModuleName)
    {
        return nativeWrappers.get(nativeModuleName).bjsGetNativeFunctions(this);
    }

    JSReference createJsNull()
    {
        return runtime.newReference(JSType.Null);
    }

    JSReference createJsUndefined()
    {
        return runtime.newReference(JSType.Undefined);
    }

    BjsNativeExports createNativeExports()
    {
        return new BjsNativeExports(runtime);
    }

    <T extends JSValue> T resolve(JSReference jsReference)
    {
        return runtime.resolveReference(jsReference);
    }

    JSReference newBoolean(boolean value)
    {
        JSReference reference = runtime.newReference(JSType.Boolean);
        ((JSBoolean) resolve(reference)).setValue(value);
        return reference;
    }

    JSReference newInteger(int value)
    {
        JSReference reference = runtime.newReference(JSType.Integer);
        ((JSInteger) resolve(reference)).setValue(value);
        return reference;
    }

    JSReference newDouble(double value)
    {
        JSReference reference = runtime.newReference(JSType.Double);
        ((JSDouble) resolve(reference)).setValue(value);
        return reference;
    }

    JSReference newString(String value)
    {
        JSReference reference = runtime.newReference(JSType.String);
        ((JSString) resolve(reference)).setValue(value);
        return reference;
    }

    JSReference newDate(Date value)
    {
        JSReference reference = runtime.newReference(JSType.Date);
        JSDate<?> jsDate = resolve(reference);
        jsDate.setValue(value);
        return reference;
    }

    <T> JSReference newExternal(T value)
    {
        JSReference reference = runtime.newReference(JSType.External);
        JSExternal<T> resolved = resolve(reference);
        resolved.setValue(value);
        return reference;
    }

    JSReference newFunction(FunctionCallback<?> callback)
    {
        JSReference reference = runtime.newReference(JSType.Function);
        JSFunction<?> jsFunction = resolve(reference);
        jsFunction.setFunction(callback);
        return reference;
    }

    JSReference newObject()
    {
        return runtime.newReference(JSType.Object);
    }

    JSReference newArray()
    {
        return runtime.newReference(JSType.Array);
    }

    JSReference callFunction(JSReference jsFunction, JSReference receiver, JSReference... arguments)
    {
        JSFunction<?> function = resolve(jsFunction);
        return function.invoke(receiver, arguments);
    }

    JSReference executeJs(String code)
    {
        return runtime.executeScript(code);
    }

    JSReference executeJs(String code, String filePath)
    {
        return runtime.executeScript(filePath, code);
    }

    void logError(String message)
    {
        System.err.println("Bjs \"" + projectName + "\" error: " + message);
    }

    void logInfo(String message)
    {
        System.out.println("Bjs \"" + projectName + "\" info: " + message);
    }
}
