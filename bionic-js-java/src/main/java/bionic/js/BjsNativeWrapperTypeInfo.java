package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;
import jjbridge.api.runtime.JSReference;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;

/**
 * A provider of information about a {@link BjsNativeWrapper} subclass.
 *
 * @param <B> The subtype of BjsNativeWrapper to get information about.
 * */
public final class BjsNativeWrapperTypeInfo<B extends BjsNativeWrapper<?>> extends BjsTypeInfo<B>
{
    private static final Map<Class<?>, BjsNativeWrapperTypeInfo<?>> cachedInfo = new HashMap<>();
    private final BjsFunctionExporter exporter;
    private final BjsBinder binder;

    private BjsNativeWrapperTypeInfo(Class<B> nativeWrapper, BjsLocator locator, BjsFunctionExporter exporter,
                                     BjsBinder binder)
    {
        super(nativeWrapper, locator);
        this.exporter = exporter;
        this.binder = binder;
    }

    JSReference bjsGetNativeFunctions(BjsContext context)
    {
        BjsNativeExports nativeExport = context.createNativeExports();
        binder.bjsBind(nativeExport);
        return exporter.bjsExportFunctions(nativeExport).getExportsObject();
    }

    /**
     * Provides the native wrapper type info for the given class.
     *
     * @param clazz the class to get information about
     * @return the information object
     * */
    public static <N extends BjsExport, T extends BjsNativeWrapper<N>> BjsNativeWrapperTypeInfo<T> get(
            @NonNull Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            cachedInfo.put(clazz, new BjsNativeWrapperTypeInfo<>(clazz, getLocator(clazz), getFunctionExporter(clazz),
                    getBinder(clazz)));
        }

        @SuppressWarnings("unchecked")
        BjsNativeWrapperTypeInfo<T> typeInfo = (BjsNativeWrapperTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    protected static BjsFunctionExporter getFunctionExporter(@NonNull Class<?> clazz)
    {
        for (Method m : clazz.getDeclaredMethods())
        {
            if (m.isAnnotationPresent(Exporter.class) && Modifier.isStatic(m.getModifiers()))
            {
                return nativeExport ->
                {
                    try
                    {
                        return (BjsNativeExports) m.invoke(null, nativeExport);
                    }
                    catch (IllegalAccessException | InvocationTargetException e)
                    {
                        throw new RuntimeException(e);
                    }
                };
            }
        }
        throw new RuntimeException("Class has no static method with Exporter annotation");
    }

    protected static BjsBinder getBinder(@NonNull Class<?> clazz)
    {
        for (Method m : clazz.getDeclaredMethods())
        {
            if (m.isAnnotationPresent(Binder.class) && Modifier.isStatic(m.getModifiers()))
            {
                return nativeExport ->
                {
                    try
                    {
                        m.invoke(null, nativeExport);
                    }
                    catch (IllegalAccessException | InvocationTargetException e)
                    {
                        throw new RuntimeException(e);
                    }
                };
            }
        }
        throw new RuntimeException("Class has no static method with Binder annotation");
    }

    interface BjsFunctionExporter
    {
        BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExport);
    }

    interface BjsBinder
    {
        void bjsBind(BjsNativeExports nativeExport);
    }

    /**
     * This annotation identifies the exporter method of a {@link BjsNativeWrapper} subclass.
     * <p><b>The annotated method is supposed to be static and to conform to the
     * {@link BjsFunctionExporter#bjsExportFunctions(BjsNativeExports)} signature.</b></p>
     * <p>The annotated method should be used to correctly associate the JavaScript methods and fields with the
     * corresponding Java ones.</p>
     * */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Exporter
    {
    }

    /**
     * This annotation identifies the binder method of a {@link BjsNativeWrapper} subclass.
     * <p><b>The annotated method is supposed to be static and to conform to the
     * {@link BjsBinder#bjsBind(BjsNativeExports)} signature.</b></p>
     * <p>The annotated method should be used to correctly associate the JavaScript constructor with the
     * corresponding Java one.</p>
     * */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Binder
    {
    }
}
