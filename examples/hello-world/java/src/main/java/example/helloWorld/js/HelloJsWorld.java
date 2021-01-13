package example.helloWorld.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;
import bionic.js.Bjs;
import bionic.js.BjsTypeInfo;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.Lambda;
import java.util.Date;
import bionic.js.BjsObject;

@BjsTypeInfo.BjsLocation(project = "HelloJsWorld", module = "HelloJsWorld")
public class HelloJsWorld extends BjsObject {
    
    protected <T extends BjsObject> HelloJsWorld(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }
    
    protected <T extends BjsObject> HelloJsWorld(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }
    
    public HelloJsWorld(JSReference jsObject) {
        this(HelloJsWorld.class, jsObject);
    }
    
    public static String hello() {
        return bjs.getString(bjs.getProperty(bjsClass, "hello"));
    }
    
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(HelloJsWorld.class).bjsClass();
    public static final Bjs bjs = BjsObjectTypeInfo.get(HelloJsWorld.class).bjsLocator.get();
    public static final Bjs.JSReferenceConverter<HelloJsWorld> bjsFactory = HelloJsWorld::new;
}