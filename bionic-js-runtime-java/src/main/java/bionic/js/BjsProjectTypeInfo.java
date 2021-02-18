package bionic.js;

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
 * A provider of information about a {@link BjsProject} subclass.
 *
 * @param <B> The subtype of BjsProject to get information about.
 * */
public final class BjsProjectTypeInfo<B extends BjsProject> extends TypeInfo<B>
{
    private static final Map<Class<?>, BjsProjectTypeInfo<?>> cachedInfo = new HashMap<>();
    private final BjsProjectInitializer initializer;

    private BjsProjectTypeInfo(Class<B> clazz, BjsProjectInitializer initializer)
    {
        super(clazz);
        this.initializer = initializer;
    }

    void initialize(Bjs bjs)
    {
        initializer.initialize(bjs);
    }

    static <T extends BjsProject> BjsProjectTypeInfo<T> get(Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            cachedInfo.put(clazz, new BjsProjectTypeInfo<>(clazz, getProjectInitializer(clazz)));
        }

        @SuppressWarnings("unchecked")
        BjsProjectTypeInfo<T> typeInfo = (BjsProjectTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    protected static BjsProjectTypeInfo.BjsProjectInitializer getProjectInitializer(Class<?> clazz)
    {
        for (Method m : clazz.getDeclaredMethods())
        {
            if (m.isAnnotationPresent(BjsProjectTypeInfo.Initializer.class) && Modifier.isStatic(m.getModifiers()))
            {
                return bjs ->
                {
                    try
                    {
                        m.invoke(null, bjs);
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

    interface BjsProjectInitializer
    {
        void initialize(Bjs bjs);
    }

    /**
     * This annotation identifies the initialization method of a {@link BjsProject} subclass.
     * <p><b>The annotated method is supposed to be static and to conform to the
     * {@link BjsProjectInitializer#initialize(Bjs)} signature.</b></p>
     * <p>The annotated method will be automatically called the first time a {@link BjsObject} class or a
     * {@link BjsExport} class is accessed in order to correctly initialize the Bjs environment.</p>
     * */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Initializer
    {
    }
}
