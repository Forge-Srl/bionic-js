package bionic.js;

import edu.umd.cs.findbugs.annotations.CheckForNull;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSArray;
import jjbridge.api.value.JSBoolean;
import jjbridge.api.value.JSDate;
import jjbridge.api.value.JSDouble;
import jjbridge.api.value.JSExternal;
import jjbridge.api.value.JSFunction;
import jjbridge.api.value.JSInteger;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSString;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;

import java.lang.reflect.Array;
import java.util.Date;
import java.util.HashMap;

public class Bjs
{
    private static final String NATIVE_HIDDEN_FIELD = "__native__";
    private static final String BJS_NATIVE_OBJ_FIELD_NAME = "bjsNativeObj";
    private static final String BJS_WRAPPER_OBJ_FIELD_NAME = "bjsWrapperObj";
    private static final String UNBOUND = "unbound";

    private static JSRuntime defaultRuntime;
    private static BjsBundle bjsBundle;
    private static Bjs get;

    private final BjsModules context;
    private final HashMap<BjsNativeObjectIdentifier<?>, BjsObject> jsValueToNative;
    private final HashMap<String, JSReference> modulesCache;
    @SuppressFBWarnings(value = "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
    public final JSReference jsNull;
    @SuppressFBWarnings(value = "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
    public final JSReference jsUndefined;

    public static void setDefaultRuntime(JSRuntime runtime)
    {
        defaultRuntime = runtime;
    }

    public static void setBundle(Class<?> forClass, String name)
    {
        bjsBundle = new BjsBundle(forClass, name);
    }

    public static synchronized Bjs get()
    {
        if (get == null)
        {
            get = new Bjs();
        }
        return get;
    }

    private Bjs()
    {
        if (defaultRuntime == null)
        {
            throw new NullPointerException("JSRuntime must be set before using Bjs");
        }
        if (bjsBundle == null)
        {
            throw new NullPointerException("BjsEnvironment.initialize() must be called before using Bjs classes");
        }
        this.context = new BjsModules(defaultRuntime, bjsBundle);
        this.jsValueToNative = new HashMap<>();
        this.modulesCache = new HashMap<>();

        this.jsNull = context.createJsNull();
        this.jsUndefined = context.createJsUndefined();
    }

    // JS FUNCTIONS CALL

    public JSReference call(JSReference jsObject, String name, JSReference... arguments)
    {
        return context.callFunction(getProperty(jsObject, name), jsObject, arguments);
    }

    public JSReference funcCall(JSReference jsFunction, JSReference... arguments)
    {
        return context.callFunction(jsFunction, jsFunction, arguments);
    }

    // JS PROPERTIES
    public JSReference getProperty(JSReference jsObject, String name)
    {
        JSObject<?> resolve = context.resolve(jsObject);
        return resolve.get(name);
    }

    public void setProperty(JSReference jsObject, String name, JSReference value)
    {
        JSObject<?> resolve = context.resolve(jsObject);
        resolve.set(name, value);
    }

    // PUT (NATIVE -> JS)
    public JSReference putPrimitive(Boolean primitive)
    {
        return primitive == null ? jsNull : context.newBoolean(primitive);
    }

    public JSReference putPrimitive(Integer primitive)
    {
        return primitive == null ? jsNull : context.newInteger(primitive);
    }

    public JSReference putPrimitive(Double primitive)
    {
        return primitive == null ? jsNull : context.newDouble(primitive);
    }

    public JSReference putPrimitive(String primitive)
    {
        return primitive == null ? jsNull : context.newString(primitive);
    }

    public JSReference putPrimitive(Date primitive)
    {
        return primitive == null ? jsNull : context.newDate(primitive);
    }

    public <T> JSReference putNative(T nativeObject)
    {
        if (nativeObject == null)
        {
            return jsNull;
        }
        else
        {
            JSReference jsReference = context.newObject();
            setProperty(jsReference, NATIVE_HIDDEN_FIELD, context.newExternal(nativeObject));
            return jsReference;
        }
    }

    public <B extends BjsNativeWrapper<T>, T extends BjsExport> JSReference putWrapped(T nativeObject,
                                                                                       Class<B> nativeWrapperClass)
    {
        if (nativeObject == null)
        {
            return jsNull;
        }

        JSReference jsNative = putNative(nativeObject);
        JSReference jsWrapperObj = getProperty(jsNative, BJS_WRAPPER_OBJ_FIELD_NAME);
        if (jsWrapperObj == null || jsWrapperObj.getNominalType().equals(JSType.Undefined))
        {
            setProperty(jsNative, BJS_WRAPPER_OBJ_FIELD_NAME, context.newString(UNBOUND));

            JSReference wrapperClass = loadModule(BjsNativeWrapperTypeInfo.get(nativeWrapperClass).wrapperPath);
            return constructObject(wrapperClass, new JSReference[]{jsNative});
        }
        else
        {
            return jsWrapperObj;
        }
    }

    public JSReference putObj(BjsObject bjsObject)
    {
        return bjsObject == null ? jsNull : bjsObject.jsObject;
    }

    public <F extends Lambda.Function> JSReference putFunc(F nativeFunc, FunctionCallback<?> jsFuncCallback)
    {
        return nativeFunc == null ? jsNull : context.newFunction(jsFuncCallback);
    }

    public <T> JSReference putArray(T[] nativeArray, NativeConverter<T> converter)
    {
        if (nativeArray == null)
        {
            return jsNull;
        }

        JSReference reference = context.newArray();
        JSArray<?> jsArray = context.resolve(reference);
        for (int i = 0; i < nativeArray.length; i++)
        {
            jsArray.set(i, converter.convert(nativeArray[i]));
        }
        return reference;
    }

    // GET (JS -> NATIVE)

    @CheckForNull
    public Boolean getBoolean(JSReference jsBoolean)
    {
        return isNullOrUndefined(jsBoolean) ? null : ((JSBoolean) context.resolve(jsBoolean)).getValue();
    }

    @CheckForNull
    public Integer getInteger(JSReference jsInteger)
    {
        return isNullOrUndefined(jsInteger) ? null : ((JSInteger) context.resolve(jsInteger)).getValue();
    }

    @CheckForNull
    public Double getDouble(JSReference jsDouble)
    {
        return isNullOrUndefined(jsDouble) ? null : ((JSDouble) context.resolve(jsDouble)).getValue();
    }

    @CheckForNull
    public String getString(JSReference jsString)
    {
        return isNullOrUndefined(jsString) ? null : ((JSString) context.resolve(jsString)).getValue();
    }

    @CheckForNull
    public Date getDate(JSReference jsDate)
    {
        if (isNullOrUndefined(jsDate))
        {
            return null;
        }
        JSDate<?> resolve = context.resolve(jsDate);
        return resolve.getValue();
    }

    @CheckForNull
    public <T> T getNative(JSReference jsNative)
    {
        if (isNullOrUndefined(jsNative))
        {
            return null;
        }
        else
        {
            JSReference nativeRef = ((JSObject<?>) context.resolve(jsNative)).get(NATIVE_HIDDEN_FIELD);
            if (isNullOrUndefined(nativeRef))
            {
                return null;
            }
            JSExternal<T> resolve = context.resolve(nativeRef);
            return resolve.getValue();
        }
    }

    @CheckForNull
    public <T extends BjsExport> T getWrapped(JSReference jsWrappedObject)
    {
        if (isNullOrUndefined(jsWrappedObject))
        {
            return null;
        }

        JSReference bjsNativeObj = getProperty(jsWrappedObject, BJS_NATIVE_OBJ_FIELD_NAME);
        if (isNullOrUndefined(bjsNativeObj))
        {
            return null;
        }

        return getNative(bjsNativeObj);
    }

    @CheckForNull
    public <F extends Lambda.Function> F getFunc(JSReference jsObject, F nativeFunc)
    {
        return isNullOrUndefined(jsObject) ? null : nativeFunc;
    }

    public BjsAnyObject getAny(JSReference jsObject)
    {
        return new BjsAnyObject(jsObject);
    }

    @CheckForNull
    public <T extends BjsObject> T getObj(JSReference jsObject, JSReferenceConverter<T> converter, Class<T> clazz)
    {
        if (isNullOrUndefined(jsObject))
        {
            return null;
        }
        BjsNativeObjectIdentifier<T> identifier = new BjsNativeObjectIdentifier<>(jsObject, clazz);

        if (jsValueToNative.containsKey(identifier))
        {
            @SuppressWarnings("unchecked")
            T nativeObject = (T) jsValueToNative.get(identifier);
            return nativeObject;
        }

        T nativeObject = converter.convert(jsObject);
        jsValueToNative.put(identifier, nativeObject);
        return nativeObject;
    }

    @CheckForNull
    @SuppressFBWarnings(value = "PZLA_PREFER_ZERO_LENGTH_ARRAYS",
            justification = "null is allowed here since coming from JS code")
    public <T> T[] getArray(JSReference jsArray, JSReferenceConverter<T> elementConverter, Class<T> nativeClass)
    {
        if (isNullOrUndefined(jsArray))
        {
            return null;
        }
        JSArray<?> array = context.resolve(jsArray);
        @SuppressWarnings("unchecked")
        T[] nativeArray = (T[]) Array.newInstance(nativeClass, array.size());
        for (int i = 0; i < nativeArray.length; i++)
        {
            nativeArray[i] = elementConverter.convert(array.get(i));
        }
        return nativeArray;
    }

    // WRAPPERS
    @CheckForNull
    public <T extends BjsExport> T getBound(JSReference jsObject, Class<T> nativeClass)
    {
        Object obj = getNative(jsObject);
        if (obj != null && obj.getClass().equals(nativeClass))
        {
            JSReference bjsWrapperObj = getProperty(jsObject, BJS_WRAPPER_OBJ_FIELD_NAME);
            if (UNBOUND.equals(getString(bjsWrapperObj)))
            {
                @SuppressWarnings("unchecked")
                T object = (T) obj;
                return object;
            }
        }
        return null;
    }

    public <T extends BjsExport> void bindNative(T nativeObject, JSReference wrapper)
    {
        JSReference nativeReference = putNative(nativeObject);
        if (nativeReference != null)
        {
            setProperty(wrapper, BJS_NATIVE_OBJ_FIELD_NAME, nativeReference);
            setProperty(nativeReference, BJS_WRAPPER_OBJ_FIELD_NAME, wrapper);
        }
    }

    public <B extends BjsNativeWrapper<T>, T extends BjsExport> void addNativeWrapper(Class<B> nativeWrapperClass)
    {
        context.addNativeWrappers(BjsNativeWrapperTypeInfo.get(nativeWrapperClass));
    }

    public JSReference[] ensureArraySize(JSReference[] in, int size)
    {
        if (in.length >= size)
        {
            return in;
        }

        JSReference[] out = new JSReference[size];
        for (int i = 0; i < out.length; i++)
        {
            out[i] = i < in.length ? in[i] : jsUndefined;
        }
        return out;
    }

    // MODULES AND ENVIRONMENT

    public JSReference loadModule(String modulePath)
    {
        if (modulesCache.containsKey(modulePath))
        {
            return modulesCache.get(modulePath);
        }

        JSReference module = context.load(modulePath);
        modulesCache.put(modulePath, module);
        return module;
    }

    public void clearJsEnvironment()
    {
        context.removeAllNativeWrappers();
        context.clearNodeLoader();
        jsValueToNative.clear();
        modulesCache.clear();
    }

    private boolean isNullOrUndefined(JSReference jsReference)
    {
        JSType type = jsReference.getNominalType();
        return type == JSType.Null || type == JSType.Undefined;
    }

    JSReference constructObject(JSReference jsClass, JSReference[] arguments)
    {
        JSFunction<?> resolve = context.resolve(jsClass);
        return resolve.invokeConstructor(arguments);
    }

    <T extends BjsObject> void createNativeObject(JSReference jsObject, T bjsObject)
    {
        @SuppressWarnings("unchecked")
        BjsNativeObjectIdentifier<T> identifier =
                new BjsNativeObjectIdentifier<>(jsObject, (Class<T>) bjsObject.getClass());
        if (!jsValueToNative.containsKey(identifier))
        {
            jsValueToNative.put(identifier, bjsObject);
        }
    }

    public interface JSReferenceConverter<T>
    {
        T convert(JSReference jsReference);
    }

    public interface NativeConverter<T>
    {
        JSReference convert(T nativeValue);
    }
}
