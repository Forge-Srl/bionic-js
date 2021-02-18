package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;

import java.util.HashMap;
import java.util.Map;

/**
 * A provider of information about a {@link BjsObject} subclass.
 *
 * @param <B> The subtype of BjsObject to get information about.
 * */
public final class BjsObjectTypeInfo<B extends BjsObject> extends BjsTypeInfo<B>
{
    private static final Map<Class<?>, BjsObjectTypeInfo<?>> cachedInfo = new HashMap<>();

    private BjsObjectTypeInfo(Class<B> objectClass, BjsLocator locator)
    {
        super(objectClass, locator);
    }

    /**
     * Provides the object type info for the given class.
     *
     * @param clazz the class to get information about
     * @return the information object
     * */
    public static <T extends BjsObject> BjsObjectTypeInfo<T> get(@NonNull Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            cachedInfo.put(clazz, new BjsObjectTypeInfo<>(clazz, getLocator(clazz)));
        }

        @SuppressWarnings("unchecked")
        BjsObjectTypeInfo<T> typeInfo = (BjsObjectTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }
}
