package bionic.js;

import jjbridge.api.runtime.JSReference;

import java.util.Objects;

public class BjsObject
{
    final JSReference jsObject;

    public BjsObject(JSReference jsObject)
    {
        this.jsObject = jsObject;
        Bjs.get().createNativeObject(this.jsObject, this);
    }

    public <T extends BjsObject> BjsObject(Class<T> type, JSReference[] arguments)
    {
        this(Bjs.get().constructObject(BjsObjectTypeInfo.get(type).bjsClass(), arguments));
    }

    public JSReference bjsCall(String name, JSReference... arguments)
    {
        return Bjs.get().call(jsObject, name, arguments);
    }

    public JSReference bjsGetProperty(String name)
    {
        return Bjs.get().getProperty(jsObject, name);
    }

    public void bjsSetProperty(String name, JSReference value)
    {
        Bjs.get().setProperty(jsObject, name, value);
    }

    public <T extends BjsObject> T castTo(Bjs.JSReferenceConverter<T> converter, Class<T> clazz)
    {
        return Bjs.get().getObj(this.jsObject, converter, clazz);
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
