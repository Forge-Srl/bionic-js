package bionic.js;

import jjbridge.api.runtime.JSReference;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.HashMap;

public class BjsNativeWrapperTypeInfo<B extends BjsNativeWrapper<?>> extends TypeInfo<B>
{
    private static final HashMap<Class<?>, BjsNativeWrapperTypeInfo<?>> cachedInfo = new HashMap<>();
    private final BjsFunctionExporter exporter;
    final String wrapperPath;
    final String name;

    private BjsNativeWrapperTypeInfo(Class<B> nativeWrapper, String wrapperPath, String name,
                                     BjsFunctionExporter exporter)
    {
        super(nativeWrapper);
        this.wrapperPath = wrapperPath;
        this.name = name;
        this.exporter = exporter;
    }

    JSReference bjsGetNativeFunctions(BjsContext context)
    {
        BjsNativeExports nativeExport = context.createNativeExports();
        exporter.bjsExportFunctions(nativeExport);
        return nativeExport.getExportsObject();
    }

    public static <N extends BjsExport, T extends BjsNativeWrapper<N>> BjsNativeWrapperTypeInfo<T> get(Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            WrapperPath path = clazz.getAnnotation(WrapperPath.class);
            if (path == null)
            {
                throw new RuntimeException("Class has no WrapperPath annotation");
            }

            Name name = clazz.getAnnotation(Name.class);
            if (name == null)
            {
                throw new RuntimeException("Class has no Name annotation");
            }

            BjsFunctionExporter exporter = null;
            for (Method m : clazz.getDeclaredMethods())
            {
                if (m.isAnnotationPresent(Exporter.class) && Modifier.isStatic(m.getModifiers()))
                {
                    exporter = nativeExport ->
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
                    break;
                }
            }
            if (exporter == null)
            {
                throw new RuntimeException("Class has no method with Exporter annotation");
            }

            cachedInfo.put(clazz, new BjsNativeWrapperTypeInfo<>(clazz, path.path(), name.name(), exporter));
        }

        @SuppressWarnings("unchecked")
        BjsNativeWrapperTypeInfo<T> typeInfo = (BjsNativeWrapperTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    interface BjsFunctionExporter
    {
        void bjsExportFunctions(BjsNativeExports nativeExport);
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface WrapperPath
    {
        String path();
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Name
    {
        String name();
    }

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Exporter
    {
    }
}
