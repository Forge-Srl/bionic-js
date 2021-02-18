package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;
import jjbridge.api.runtime.JSReference;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A generic provider of information about the specified type. The type must be associated with a JavaScript class
 * instance.
 *
 * @param <B> The class type to get information about.
 * */
public abstract class BjsTypeInfo<B> extends TypeInfo<B>
{
    public final BjsLocator bjsLocator;

    BjsTypeInfo(Class<B> clazz, BjsLocator locator)
    {
        super(clazz);
        this.bjsLocator = locator;
    }

    /**
     * Get the reference to the JavaScript class instance associated with the class about which this object provides
     * information.
     *
     * @return The reference to the instance of the JavaScript class
     * */
    public JSReference bjsClass()
    {
        return bjsLocator.get().loadModule(bjsLocator.moduleName);
    }

    protected static BjsLocator getLocator(@NonNull Class<?> clazz)
    {
        BjsLocation a = clazz.getAnnotation(BjsLocation.class);
        if (a == null)
        {
            throw new RuntimeException("Class has no BjsLocation annotation");
        }

        return new BjsLocator(clazz.getPackage().getName(), a.project(), a.module());
    }

    /**
     * The unique association between a Java class and the correspondent JavaScript class.
     * */
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BjsLocation
    {
        /**
         * The name of the Bjs project containing the JavaScript class associated with the Java class.
         *
         * @return The name of the Bjs project
         * */
        String project();
        /**
         * The name of the JavaScript class associated with the Java class.
         *
         * @return The name of the JavaScript class
         * */
        String module();
    }
}
