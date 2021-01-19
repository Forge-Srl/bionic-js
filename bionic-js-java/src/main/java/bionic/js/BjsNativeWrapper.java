package bionic.js;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * The super type of every Java class which binds a {@link BjsExport} class to the associated JavaScript native
 * interface.
 *
 * @param <T> the type of the Java class bound to the JavaScript one
 */
public abstract class BjsNativeWrapper<T extends BjsExport>
{
    protected final Class<T> realImplementation;

    protected static <S extends BjsExport> Class<? extends S> getClass(Class<S> extending, String fullClassName)
    {
        try
        {
            Class<?> clazz = Class.forName(fullClassName);
            return clazz.asSubclass(extending);
        }
        catch (ClassNotFoundException e)
        {
            throw new RuntimeException(e);
        }
    }

    protected BjsNativeWrapper(Class<T> realImplementation)
    {
        this.realImplementation = realImplementation;
    }

    protected final <R> R invokeStatic(String name, Class<?>[] types, Object[] args)
    {
        try
        {
            Method method = realImplementation.getMethod(name, types);
            @SuppressWarnings("unchecked")
            R invoke = (R) method.invoke(realImplementation, args);
            return invoke;
        }
        catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e)
        {
            throw new RuntimeException(e);
        }
    }

    protected final T invokeConstructor(Class<?>[] types, Object[] args)
    {
        try
        {
            Constructor<? extends T> constructor = realImplementation.getConstructor(types);
            return constructor.newInstance(args);
        }
        catch (NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e)
        {
            throw new RuntimeException(e);
        }
    }
}
