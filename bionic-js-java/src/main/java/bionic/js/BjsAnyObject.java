package bionic.js;

import jjbridge.api.runtime.JSReference;

public class BjsAnyObject
{
    public JSReference jsObj;

    public BjsAnyObject(JSReference jsObj)
    {
        this.jsObj = jsObj;
    }

    public BjsAnyObject(BjsObject bjsObj)
    {
        this(bjsObj.jsObject);
    }

    public <T extends BjsObject> T getObject(Bjs.JSReferenceConverter<T> converter, Class<T> clazz)
    {
        return BjsObjectTypeInfo.get(clazz).bjsLocator.get().getObj(jsObj, converter, clazz);
    }
}
