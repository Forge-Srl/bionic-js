package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;
import jjbridge.api.runtime.JSReference;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public abstract class BjsTypeInfo<B> extends TypeInfo<B>
{
    public final BjsLocator bjsLocator;

    BjsTypeInfo(Class<B> clazz, BjsLocator locator)
    {
        super(clazz);
        this.bjsLocator = locator;
    }

    public JSReference bjsClass()
    {
        return bjsLocator.get().loadModule(bjsLocator.moduleName);
    }

    public static BjsLocator getLocator(@NonNull Class<?> clazz)
    {
        BjsLocation a = clazz.getAnnotation(BjsLocation.class);
        if (a == null)
        {
            throw new RuntimeException("Class has no BjsLocation annotation");
        }

        return new BjsLocator(clazz.getPackage().getName(), a.project(), a.module());
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BjsLocation
    {
        String project();
        String module();
    }
}
