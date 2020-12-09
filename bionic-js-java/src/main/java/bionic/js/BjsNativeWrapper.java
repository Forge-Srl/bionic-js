package bionic.js;

import org.reflections.Reflections;
import org.reflections.scanners.SubTypesScanner;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public abstract class BjsNativeWrapper<T extends BjsExport>
{
    private static Reflections _reflections;
    protected final Class<T> realImplementation;

    private static synchronized Reflections reflections()
    {
        if (_reflections == null)
        {
            _reflections = new Reflections("", new SubTypesScanner());
        }
        return _reflections;
    }

    protected static <S extends BjsExport> Class<? extends S> getClass(Class<S> extending, String withName)
    {
        return reflections().getSubTypesOf(extending).stream()
                .filter(someClass -> someClass.getSimpleName().equals(withName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(new ClassNotFoundException(withName)));
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
            return (R) method.invoke(realImplementation, args);
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
