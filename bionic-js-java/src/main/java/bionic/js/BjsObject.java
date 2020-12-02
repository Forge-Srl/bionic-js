package bionic.js;

import jjbridge.api.runtime.JSReference;

import java.util.Objects;

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

    public JSReference bjsCall(String name, JSReference... arguments)
    {
        return bjs().call(jsObject, name, arguments);
    }

    public JSReference bjsGetProperty(String name)
    {
        return bjs().getProperty(jsObject, name);
    }

    public void bjsSetProperty(String name, JSReference value)
    {
        bjs().setProperty(jsObject, name, value);
    }

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
