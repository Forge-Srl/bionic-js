package bionic.js;

import jjbridge.api.runtime.JSReference;

class BjsNativeObjectIdentifier<T>
{
    private final JSReference jsReference;
    private final Class<T> objectType;

    BjsNativeObjectIdentifier(JSReference jsReference, Class<T> clazz)
    {
        this.jsReference = jsReference;
        this.objectType = clazz;
    }

    @Override
    public int hashCode()
    {
        return jsReference.hashCode() * 997 + objectType.hashCode();
    }

    @Override
    public boolean equals(Object o)
    {
        if (!(o instanceof BjsNativeObjectIdentifier))
        {
            return false;
        }

        BjsNativeObjectIdentifier<?> that = (BjsNativeObjectIdentifier<?>) o;
        return jsReference.equals(that.jsReference) && objectType.equals(that.objectType);
    }
}
