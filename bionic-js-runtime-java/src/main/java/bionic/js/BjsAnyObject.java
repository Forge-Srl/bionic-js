package bionic.js;

import jjbridge.api.runtime.JSReference;

/**
 * A generic JavaScript object exposed to JavaScript.
 * <p>This type allows to expose any JavaScript object as a Java object without having to define a {@link BjsObject}. As
 * a drawback you cannot access any method or field of the JavaScript object.</p>
 * */
public class BjsAnyObject
{
    public JSReference jsObj;

    BjsAnyObject(JSReference jsObj)
    {
        this.jsObj = jsObj;
    }

    public BjsAnyObject(BjsObject bjsObj)
    {
        this(bjsObj.jsObject);
    }

    /**
     * Provides an access to this same JavaScript object as an instance of the given class.
     *
     * @param <T> The type of the JavaScript object after cast
     * @param clazz The instance of the target class type
     * @param converter The strategy used to convert the JavaScript object to the target type
     * @return this JavaScript object casted to the given type.
     * */
    public <T extends BjsObject> T getObject(Bjs.JSReferenceConverter<T> converter, Class<T> clazz)
    {
        return BjsObjectTypeInfo.get(clazz).bjsLocator.get().getObj(jsObj, converter, clazz);
    }
}
