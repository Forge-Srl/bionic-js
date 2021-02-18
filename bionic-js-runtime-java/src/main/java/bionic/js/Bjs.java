package bionic.js;

import edu.umd.cs.findbugs.annotations.CheckForNull;
import edu.umd.cs.findbugs.annotations.NonNull;
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
import java.util.Map;

/**
 * The environment which provides JavaScript objects get/put and module loading capabilities.
 * */
public class Bjs
{
    private static final String NATIVE_HIDDEN_FIELD = "__native__";
    private static final String BJS_NATIVE_OBJ_FIELD_NAME = "bjsNativeObj";
    private static final String BJS_WRAPPER_OBJ_FIELD_NAME = "bjsWrapperObj";
    private static final String UNBOUND = "unbound";
    private static final Map<String, Bjs> projects = new HashMap<>();

    private static JSRuntime defaultRuntime;

    private final String projectName;
    private final HashMap<BjsNativeObjectIdentifier<?>, BjsObject> jsValueToNative;
    private final HashMap<String, JSReference> modulesCache;

    private BjsContext context;

    static void setDefaultRuntime(JSRuntime runtime)
    {
        defaultRuntime = runtime;
    }

    static synchronized Bjs get(String packageName, @NonNull String projectName)
    {
        String fullClassName = packageName == null || packageName.isEmpty()
                ? "Bjs" + projectName
                : packageName + ".Bjs" + projectName;

        if (projects.containsKey(fullClassName))
        {
            return projects.get(fullClassName);
        }
        else
        {
            Bjs bjs = new Bjs(projectName);
            try
            {
                Class<?> initializerClass = Class.forName(fullClassName);
                Class<? extends BjsProject> projectClass = initializerClass.asSubclass(BjsProject.class);
                BjsProjectTypeInfo.get(projectClass).initialize(bjs);
            }
            catch (ClassNotFoundException e)
            {
                throw new RuntimeException(e);
            }

            projects.put(fullClassName, bjs);
            return bjs;
        }
    }

    private Bjs(@NonNull String projectName)
    {
        this.projectName = projectName;
        this.jsValueToNative = new HashMap<>();
        this.modulesCache = new HashMap<>();
    }

    /**
     * Loads a Bjs bundle.
     *
     * <p>The bundle must be a JavaScript file called {@code `bundleName`.js} inside a folder called
     * {@code `bundleName`.bjs} (where {@code `bundleName`} is the value of the bundleName argument). The folder must be
     * placed in the resources directory.</p>
     *
     * @param forClass the {@link BjsProject} class instance associated to the bundle
     * @param bundleName the name of the bundle to load
     * */
    public void loadBundle(@NonNull Class<?> forClass, @NonNull String bundleName)
    {
        if (defaultRuntime == null)
        {
            throw new NullPointerException("JSRuntime must be set before loading a bundle");
        }

        jsValueToNative.clear();
        modulesCache.clear();
        context = new BjsContext(defaultRuntime, projectName);

        BjsBundle bundle = new BjsBundle(forClass, bundleName + ".bjs");
        String file = bundle.loadFile(bundleName + ".js");
        if (file == null)
        {
            throw new RuntimeException("Cannot load bundle " + bundleName + " file");
        }
        context.executeJs(file, bundleName + ".bjs/" + bundleName + ".js");
    }

    /**
     * Register a native wrapper class to the Bjs environment.
     *
     * @param <B> the native wrapper type
     * @param <T> the type wrapped by the wrapper
     * @param nativeWrapperClass the class to register
     * */
    public <B extends BjsNativeWrapper<T>, T extends BjsExport> void addNativeWrapper(
            @NonNull Class<B> nativeWrapperClass)
    {
        context.addNativeWrapper(nativeWrapperClass);
    }

    /**
     * Creates a reference to JavaScript {@code null} value.
     *
     * @return a reference to JavaScript {@code null}
     * */
    public JSReference jsNull()
    {
        return context.createJsNull();
    }

    /**
     * Creates a generic JavaScript null object.
     * <p>This method is equivalent to {@code getAny(jsNull())}.</p>
     *
     * @return a JavaScript null object
     * */
    public BjsAnyObject anyNull()
    {
        return getAny(jsNull());
    }

    /**
     * Creates a reference to JavaScript {@code undefined} value.
     *
     * @return a reference to JavaScript {@code undefined}
     * */
    public JSReference jsUndefined()
    {
        return context.createJsUndefined();
    }

    // JS FUNCTIONS CALL

    /**
     * Invokes a method of the given object.
     *
     * @param jsObject the target object
     * @param name the name of the method
     * @param arguments the arguments to pass to the method
     * @return the return value of the invoked method
     * */
    public JSReference call(JSReference jsObject, String name, JSReference... arguments)
    {
        return context.callFunction(getProperty(jsObject, name), jsObject, arguments);
    }

    /**
     * Invokes a function.
     *
     * @param jsFunction the target function
     * @param arguments the arguments to pass to the function
     * @return the return value of the invoked function
     * */
    public JSReference funcCall(JSReference jsFunction, JSReference... arguments)
    {
        return context.callFunction(jsFunction, jsFunction, arguments);
    }

    // JS PROPERTIES

    /**
     * Gets a reference to a property of an object.
     *
     * @param jsObject the target object
     * @param name the name of the desired property
     * @return the reference to the property
     * */
    public JSReference getProperty(JSReference jsObject, String name)
    {
        JSObject<?> resolve = context.resolve(jsObject);
        return resolve.get(name);
    }

    /**
     * Sets the reference to a property of an object.
     *
     * @param jsObject the target object
     * @param name the name of the desired property
     * @param value the new reference of the property
     * */
    public void setProperty(JSReference jsObject, String name, JSReference value)
    {
        JSObject<?> resolve = context.resolve(jsObject);
        resolve.set(name, value);
    }

    // PUT (NATIVE -> JS)

    /**
     * Creates a reference to a JavaScript Boolean value.
     *
     * @param primitive the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putPrimitive(Boolean primitive)
    {
        return primitive == null ? jsNull() : context.newBoolean(primitive);
    }

    /**
     * Creates a reference to a JavaScript Integer value.
     *
     * @param primitive the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putPrimitive(Integer primitive)
    {
        return primitive == null ? jsNull() : context.newInteger(primitive);
    }

    /**
     * Creates a reference to a JavaScript Double value.
     *
     * @param primitive the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putPrimitive(Double primitive)
    {
        return primitive == null ? jsNull() : context.newDouble(primitive);
    }

    /**
     * Creates a reference to a JavaScript String value.
     *
     * @param primitive the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putPrimitive(String primitive)
    {
        return primitive == null ? jsNull() : context.newString(primitive);
    }

    /**
     * Creates a reference to a JavaScript Date value.
     *
     * @param primitive the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putPrimitive(Date primitive)
    {
        return primitive == null ? jsNull() : context.newDate(primitive);
    }

    /**
     * Stores a Java object in a JavaScript reference.
     * <p>If the object class has an associated native wrapper class, you can also use
     * {@link #putWrapped(BjsExport, Class)}</p>
     *
     * @param nativeObject the object to store
     * @return a reference to the JavaScript value
     * */
    public <T> JSReference putNative(T nativeObject)
    {
        if (nativeObject == null)
        {
            return jsNull();
        }
        else
        {
            JSReference jsReference = context.newObject();
            setProperty(jsReference, NATIVE_HIDDEN_FIELD, context.newExternal(nativeObject));
            return jsReference;
        }
    }

    /**
     * Stores a Java object in a JavaScript reference.
     * <p>Use can use this method if the object class is mapped to a JavaScript native interface via a native wrapper
     * class.</p>
     *
     * @param nativeObject the object to store
     * @param nativeWrapperClass the class instance of the associated native wrapper
     * @return a reference to the JavaScript value
     * */
    public <B extends BjsNativeWrapper<T>, T extends BjsExport> JSReference putWrapped(T nativeObject,
            Class<B> nativeWrapperClass)
    {
        if (nativeObject == null)
        {
            return jsNull();
        }

        JSReference jsNative = putNative(nativeObject);
        JSReference jsWrapperObj = getProperty(jsNative, BJS_WRAPPER_OBJ_FIELD_NAME);
        if (jsWrapperObj == null || jsWrapperObj.getNominalType().equals(JSType.Undefined))
        {
            setProperty(jsNative, BJS_WRAPPER_OBJ_FIELD_NAME, context.newString(UNBOUND));

            JSReference wrapperClass = BjsNativeWrapperTypeInfo.get(nativeWrapperClass).bjsClass();
            return constructObject(wrapperClass, new JSReference[]{jsNative});
        }
        else
        {
            return jsWrapperObj;
        }
    }

    /**
     * Creates a reference to a JavaScript Object value.
     *
     * @param bjsObject the value of the reference
     * @return a reference to the JavaScript value
     * */
    public JSReference putObj(BjsObject bjsObject)
    {
        return bjsObject == null ? jsNull() : bjsObject.jsObject;
    }

    /**
     * Creates a reference to a JavaScript Function value.
     *
     * @param nativeFunc the value of the reference
     * @param jsFuncCallback the function implementation
     * @return a reference to the JavaScript value
     * */
    public <F extends Lambda.Function> JSReference putFunc(F nativeFunc, FunctionCallback<?> jsFuncCallback)
    {
        return nativeFunc == null ? jsNull() : context.newFunction(jsFuncCallback);
    }

    /**
     * Creates a reference to a JavaScript Array value.
     *
     * @param nativeArray the value of the reference
     * @param converter the strategy to create a reference for each array item
     * @return a reference to the JavaScript value
     * */
    public <T> JSReference putArray(T[] nativeArray, NativeConverter<T> converter)
    {
        if (nativeArray == null)
        {
            return jsNull();
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

    /**
     * Extract the Boolean value from a reference to a JavaScript value.
     *
     * @param jsBoolean the reference to the JavaScript value
     * @return the referenced value
     * */
    @CheckForNull
    public Boolean getBoolean(JSReference jsBoolean)
    {
        return isNullOrUndefined(jsBoolean) ? null : ((JSBoolean) context.resolve(jsBoolean)).getValue();
    }

    /**
     * Extract the Integer value from a reference to a JavaScript value.
     *
     * @param jsInteger the reference to the JavaScript value
     * @return the referenced value
     * */
    @CheckForNull
    public Integer getInteger(JSReference jsInteger)
    {
        return isNullOrUndefined(jsInteger) ? null : ((JSInteger) context.resolve(jsInteger)).getValue();
    }

    /**
     * Extract the Double value from a reference to a JavaScript value.
     *
     * @param jsDouble the reference to the JavaScript value
     * @return the referenced value
     * */
    @CheckForNull
    public Double getDouble(JSReference jsDouble)
    {
        return isNullOrUndefined(jsDouble) ? null : ((JSDouble) context.resolve(jsDouble)).getValue();
    }

    /**
     * Extract the String value from a reference to a JavaScript value.
     *
     * @param jsString the reference to the JavaScript value
     * @return the referenced value
     * */
    @CheckForNull
    public String getString(JSReference jsString)
    {
        return isNullOrUndefined(jsString) ? null : ((JSString) context.resolve(jsString)).getValue();
    }

    /**
     * Extract the Date value from a reference to a JavaScript value.
     *
     * @param jsDate the reference to the JavaScript value
     * @return the referenced value
     * */
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

    /**
     * Extract the Java object from a reference to a JavaScript value.
     *
     * @param jsNative the reference to the JavaScript value
     * @return the referenced Java object
     * */
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

    /**
     * Extract the Java object from a reference to a JavaScript native interface value.
     *
     * @param jsWrappedObject the reference to the JavaScript native wrapper
     * @return the referenced Java object
     * */
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

    /**
     * Extract the Java function from a reference to a JavaScript value.
     *
     * @param jsObject the reference to the JavaScript value
     * @param nativeFunc the function implementation
     * @return the referenced function
     * */
    @CheckForNull
    public <F extends Lambda.Function> F getFunc(JSReference jsObject, F nativeFunc)
    {
        return isNullOrUndefined(jsObject) ? null : nativeFunc;
    }

    /**
     * Extract a generic JavaScript object from its JavaScript reference.
     *
     * @param jsObject the reference to the JavaScript object
     * @return the referenced object
     * */
    public BjsAnyObject getAny(JSReference jsObject)
    {
        return new BjsAnyObject(jsObject);
    }

    /**
     * Extract the Java object from a reference to a JavaScript exported object.
     *
     * @param jsObject the reference to the JavaScript object
     * @param converter the strategy to convert the JavaScript reference to the desired value
     * @param clazz the class instance of the returning type
     * @return the referenced Java object
     * */
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

    /**
     * Extract the Array value from a reference to a JavaScript value.
     *
     * @param jsArray the reference to the JavaScript value
     * @param elementConverter the strategy to convert the JavaScript array items
     * @param nativeClass the class instance of the returning type
     * @return the referenced value
     * */
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

    /**
     * Extract a Java exported object from the reference to the given JavaScript native interface, if available.
     *
     * @param jsObject the reference to the Javascript object
     * @param nativeClass the class instance of the result
     * @return the exported Java object if available, or {@code null} otherwise
     * */
    @CheckForNull
    public <T extends BjsExport> T getBound(JSReference jsObject, Class<T> nativeClass)
    {
        Object obj = getNative(jsObject);
        if (obj != null && nativeClass.isAssignableFrom(obj.getClass()))
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

    /**
     * Binds a Java exported object with a reference to JavaScript native wrapper instance.
     *
     * @param nativeObject the native object to bind
     * @param wrapper the JavaScript object reference
     * */
    public <T extends BjsExport> void bindNative(T nativeObject, JSReference wrapper)
    {
        JSReference nativeReference = putNative(nativeObject);
        if (nativeReference != null)
        {
            setProperty(wrapper, BJS_NATIVE_OBJ_FIELD_NAME, nativeReference);
            setProperty(nativeReference, BJS_WRAPPER_OBJ_FIELD_NAME, wrapper);
        }
    }

    /**
     * Returns an array with at least the length specified.
     * <p>Specifically, it returns:</p>
     * <ul>
     *     <li>the original array if it is already bigger (or equal) than the given size.</li>
     *     <li>Otherwise a new array is created; the elements from the starting array keep the same positions, while the
     *     remaining slots are filled with JavaScript references to undefined.</li>
     * </ul>
     *
     * @see #jsUndefined()
     *
     * @param in the array to ensure the length of
     * @param size the length to ensure
     * @return an array with the given size
     * */
    public JSReference[] ensureArraySize(JSReference[] in, int size)
    {
        if (in.length >= size)
        {
            return in;
        }

        JSReference[] out = new JSReference[size];
        for (int i = 0; i < out.length; i++)
        {
            out[i] = i < in.length ? in[i] : jsUndefined();
        }
        return out;
    }

    // MODULES AND ENVIRONMENT

    JSReference loadModule(@NonNull String moduleName)
    {
        if (modulesCache.containsKey(moduleName))
        {
            return modulesCache.get(moduleName);
        }
        if (this.context == null)
        {
            throw new RuntimeException("Bjs context was not initialized");
        }
        JSReference export = context.getModule(moduleName);
        if (isNullOrUndefined(export))
        {
            throw new RuntimeException("Module " + moduleName + " was not found in Bjs bundle");
        }
        JSReference module = getProperty(export, moduleName);
        if (module.getActualType() == JSType.Undefined)
        {
            module = export;
        }

        modulesCache.put(moduleName, module);
        return module;
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
            return;
        }
        context.logError("Bjs object " + bjsObject.getClass().getSimpleName()
                + " was initialized with a js object already bound with another bjs object");
    }

    /**
     * The strategy to convert a JavaScript reference to the corresponding Java object.
     *
     * @param <T> the type of the Java object after conversion
     * */
    public interface JSReferenceConverter<T>
    {
        T convert(JSReference jsReference);
    }

    /**
     * The strategy to convert a Java object to the corresponding JavaScript reference.
     *
     * @param <T> the type of the Java object before conversion
     * */
    public interface NativeConverter<T>
    {
        JSReference convert(T nativeValue);
    }
}
