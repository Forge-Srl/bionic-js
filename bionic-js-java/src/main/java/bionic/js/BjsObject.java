package bionic.js;

import jjbridge.api.runtime.JSReference;

import java.util.Objects;

/**
 * The super type of every Java class which wraps a JavaScript class.
 * */
public abstract class BjsObject
{
    private final BjsLocator locator;
    final JSReference jsObject;

    protected <T extends BjsObject> BjsObject(Class<T> type, JSReference jsObject)
    {
        this.locator = BjsObjectTypeInfo.get(type).bjsLocator;
        this.jsObject = jsObject;
        bjs().createNativeObject(this.jsObject, this);
    }

    protected <T extends BjsObject> BjsObject(Class<T> type, JSReference[] arguments)
    {
        BjsObjectTypeInfo<T> typeInfo = BjsObjectTypeInfo.get(type);
        this.locator = typeInfo.bjsLocator;
        this.jsObject = bjs().constructObject(typeInfo.bjsClass(), arguments);
        bjs().createNativeObject(this.jsObject, this);
    }

    private Bjs bjs()
    {
        return locator.get();
    }

    /**
     * Invokes a method of this JavaScript object.
     *
     * @param name the name of the method to invoke
     * @param arguments the arguments to pass to the method
     * @return the return value of the invoked method
     * */
    public JSReference bjsCall(String name, JSReference... arguments)
    {
        return bjs().call(jsObject, name, arguments);
    }

    /**
     * Invokes a getter of this JavaScript object.
     *
     * @param name the name of the getter to invoke
     * @return the return value of the invoked getter
     * */
    public JSReference bjsGetProperty(String name)
    {
        return bjs().getProperty(jsObject, name);
    }

    /**
     * Invokes a setter of this JavaScript object.
     *
     * @param name the name of the setter to invoke
     * @param value the value to pass to the setter
     * */
    public void bjsSetProperty(String name, JSReference value)
    {
        bjs().setProperty(jsObject, name, value);
    }

    /**
     * Provides an access to this same JavaScript object as an instance of the given class.
     *
     * @param <T> The type of the JavaScript object after cast
     * @param clazz The instance of the target class type
     * @param converter The strategy used to convert the JavaScript object to the target type
     * @return this JavaScript object casted to the given type.
     * */
    public <T extends BjsObject> T castTo(Bjs.JSReferenceConverter<T> converter, Class<T> clazz)
    {
        return bjs().getObj(this.jsObject, converter, clazz);
    }

    @Override
    public boolean equals(Object o)
    {
        return o instanceof BjsObject && ((BjsObject) o).jsObject.equals(this.jsObject);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(jsObject);
    }
}
