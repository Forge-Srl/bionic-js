package bionic.js;

import jjbridge.api.runtime.JSReference;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.HashMap;

public class BjsObjectTypeInfo<B extends BjsObject> extends TypeInfo<B>
{
    private static final HashMap<Class<?>, BjsObjectTypeInfo<?>> cachedInfo = new HashMap<>();
    public final String bjsModulePath;

    private BjsObjectTypeInfo(Class<B> objectClass, String bjsModulePath)
    {
        super(objectClass);
        this.bjsModulePath = bjsModulePath;
    }

    public JSReference bjsClass()
    {
        return Bjs.get().loadModule(bjsModulePath);
    }

    public static <T extends BjsObject> BjsObjectTypeInfo<T> get(Class<T> clazz)
    {
        if (!cachedInfo.containsKey(clazz))
        {
            BjsModulePath a = clazz.getAnnotation(BjsModulePath.class);
            if (a == null)
            {
                throw new RuntimeException("Class has no BjsModulePath annotation");
            }

            cachedInfo.put(clazz, new BjsObjectTypeInfo<>(clazz, a.path()));
        }

        @SuppressWarnings("unchecked")
        BjsObjectTypeInfo<T> typeInfo = (BjsObjectTypeInfo<T>) cachedInfo.get(clazz);
        return typeInfo;
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BjsModulePath
    {
        String path();
    }
}
