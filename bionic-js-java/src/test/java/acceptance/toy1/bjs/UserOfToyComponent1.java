package acceptance.toy1.bjs;

import bionic.js.Bjs;
import bionic.js.BjsObject;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.BjsTypeInfo;
import jjbridge.api.runtime.JSReference;

@BjsTypeInfo.BjsLocation(project = "TestProject", module = "UserOfToyComponent1")
public class UserOfToyComponent1 extends BjsObject
{
    public static final Bjs.JSReferenceConverter<UserOfToyComponent1> bjsFactory = UserOfToyComponent1::new;
    public static final Bjs bjs = BjsObjectTypeInfo.get(UserOfToyComponent1.class).bjsLocator.get();
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(UserOfToyComponent1.class).bjsClass();

    protected <T extends BjsObject> UserOfToyComponent1(Class<T> type, JSReference jsObject)
    {
        super(type, jsObject);
    }

    protected <T extends BjsObject> UserOfToyComponent1(Class<T> type, JSReference[] arguments)
    {
        super(type, arguments);
    }

    public UserOfToyComponent1(JSReference jsObject)
    {
        this(UserOfToyComponent1.class, jsObject);
    }

    public static ToyComponent1BjsExport lastToy()
    {
        return bjs.getWrapped(bjs.getProperty(bjsClass, "lastToy"));
    }

    public static void lastToy(ToyComponent1BjsExport value)
    {
        bjs.setProperty(bjsClass, "lastToy", bjs.putWrapped(value, ToyComponent1BjsExport.Wrapper.class));
    }

    public static Integer add(Integer offset, Integer int1, Integer int2)
    {
        return bjs.getInteger(bjs.call(bjsClass, "add", bjs.putPrimitive(offset), bjs.putPrimitive(int1),
                bjs.putPrimitive(int2)));
    }

    public static ToyComponent1BjsExport getToy(Integer int1, Integer int2)
    {
        return bjs.getWrapped(bjs.call(bjsClass, "getToy", bjs.putPrimitive(int1), bjs.putPrimitive(int2)));
    }

    public static Integer getSum(ToyComponent1BjsExport toy1, ToyComponent1BjsExport toy2)
    {
        return bjs.getInteger(bjs.call(bjsClass, "getSum", bjs.putWrapped(toy1, ToyComponent1BjsExport.Wrapper.class),
                bjs.putWrapped(toy2, ToyComponent1BjsExport.Wrapper.class)));
    }

    public static Integer getSum2(ToyComponent2BjsExport toy1, ToyComponent1BjsExport toy2)
    {
        return bjs.getInteger(bjs.call(bjsClass, "getSum2", bjs.putWrapped(toy1, ToyComponent2BjsExport.Wrapper.class),
                bjs.putWrapped(toy2, ToyComponent1BjsExport.Wrapper.class)));
    }

    public static Boolean isLastToy(ToyComponent1BjsExport toy)
    {
        return bjs.getBoolean(bjs.call(bjsClass, "isLastToy", bjs.putWrapped(toy, ToyComponent1BjsExport.Wrapper.class)));
    }

    public static Double piSum()
    {
        return bjs.getDouble(bjs.call(bjsClass, "piSum"));
    }

    public static Integer additionalValue(ToyComponent2BjsExport toy)
    {
        return bjs.getInteger(bjs.call(bjsClass, "additionalValue", bjs.putWrapped(toy, ToyComponent2BjsExport.Wrapper.class)));
    }
}
