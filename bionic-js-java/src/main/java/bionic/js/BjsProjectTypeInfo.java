package bionic.js;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.HashMap;

public class BjsProjectTypeInfo<B extends BjsProject> extends TypeInfo<B>
{
    private static final HashMap<Class<?>, BjsProjectTypeInfo<?>> cachedInfo = new HashMap<>();
    private final BjsProjectInitializer initializer;

    private BjsProjectTypeInfo(Class<B> clazz, BjsProjectInitializer initializer)
    {
        super(clazz);
        this.initializer = initializer;
    }

    public void initialize(Bjs bjs)
    {
        initializer.initialize(bjs);
    }

    public static <T extends BjsProject> BjsProjectTypeInfo<T> get(Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            cachedInfo.put(clazz, new BjsProjectTypeInfo<>(clazz, getProjectInitializer(clazz)));
        }

        @SuppressWarnings("unchecked")
        BjsProjectTypeInfo<T> typeInfo = (BjsProjectTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    public static BjsProjectTypeInfo.BjsProjectInitializer getProjectInitializer(Class<?> clazz)
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
        throw new RuntimeException("Class has no method with Exporter annotation");
    }

    interface BjsProjectInitializer
    {
        void initialize(Bjs bjs);
    }

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Initializer
    {
    }
}
