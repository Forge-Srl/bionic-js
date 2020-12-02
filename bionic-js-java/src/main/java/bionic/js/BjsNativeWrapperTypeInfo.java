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

public class BjsNativeWrapperTypeInfo<B extends BjsNativeWrapper<?>> extends BjsTypeInfo<B>
{
    private static final HashMap<Class<?>, BjsNativeWrapperTypeInfo<?>> cachedInfo = new HashMap<>();
    private final BjsFunctionExporter exporter;

    private BjsNativeWrapperTypeInfo(Class<B> nativeWrapper, BjsLocator locator, BjsFunctionExporter exporter)
    {
        super(nativeWrapper, locator);
        this.exporter = exporter;
    }

    JSReference bjsGetNativeFunctions(BjsContext context)
    {
        BjsNativeExports nativeExport = context.createNativeExports();
        exporter.bjsExportFunctions(nativeExport);
        return nativeExport.getExportsObject();
    }

    public static <N extends BjsExport, T extends BjsNativeWrapper<N>> BjsNativeWrapperTypeInfo<T> get(
            @NonNull Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            cachedInfo.put(clazz, new BjsNativeWrapperTypeInfo<>(clazz, getLocator(clazz), getFunctionExporter(clazz)));
        }

        @SuppressWarnings("unchecked")
        BjsNativeWrapperTypeInfo<T> typeInfo = (BjsNativeWrapperTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    public static BjsFunctionExporter getFunctionExporter(@NonNull Class<?> clazz)
    {
        for (Method m : clazz.getDeclaredMethods())
        {
            if (m.isAnnotationPresent(Exporter.class) && Modifier.isStatic(m.getModifiers()))
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
        throw new RuntimeException("Class has no method with Exporter annotation");
    }

    interface BjsFunctionExporter
    {
        void bjsExportFunctions(BjsNativeExports nativeExport);
    }

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Exporter
    {
    }
}
