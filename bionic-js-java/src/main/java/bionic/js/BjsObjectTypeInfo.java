package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;

import java.util.HashMap;

public class BjsObjectTypeInfo<B extends BjsObject> extends BjsTypeInfo<B>
{
    private static final HashMap<Class<?>, BjsObjectTypeInfo<?>> cachedInfo = new HashMap<>();

    private BjsObjectTypeInfo(Class<B> objectClass, BjsLocator locator)
    {
        super(objectClass, locator);
    }

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
