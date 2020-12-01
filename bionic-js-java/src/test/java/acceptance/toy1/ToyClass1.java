package acceptance.toy1;

import bionic.js.Bjs;
import bionic.js.BjsAnyObject;
import bionic.js.BjsObject;
import bionic.js.BjsObjectTypeInfo;
import bionic.js.BjsTypeInfo;
import bionic.js.Lambda;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;

import java.util.Date;

@BjsTypeInfo.BjsLocation(project = "TestProject", module = "ToyClass1")
public class ToyClass1 extends BjsObject
{
    // BJS HELPERS
    public static final Bjs.JSReferenceConverter<ToyClass1> bjsFactory = ToyClass1::new;
    public static final Bjs bjs = BjsObjectTypeInfo.get(ToyClass1.class).bjsLocator.get();
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(ToyClass1.class).bjsClass();

    protected <T extends BjsObject> ToyClass1(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }

    protected <T extends BjsObject> ToyClass1(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }

    public ToyClass1(JSReference jsObject) {
        this(ToyClass1.class, jsObject);
    }

    public ToyClass1(JSReference[] arguments) {
        this(ToyClass1.class, arguments);
    }

    public ToyClass1() {
        this(new JSReference[0]);
    }

    // STATIC PROPERTIES

    public static String getNativeAutoProp_static() {
        return bjs.getString(bjs.getProperty(bjsClass, "nativeAutoProp"));
    }

    public static void setNativeAutoProp_static(String value) {
        bjs.setProperty(bjsClass, "nativeAutoProp", bjs.putPrimitive(value));
    }

    public static BjsAnyObject getAnyAutoProp_static() {
        return bjs.getAny(bjs.getProperty(bjsClass, "anyAutoProp"));
    }

    public static void setAnyAutoProp_static(BjsAnyObject value) {
        bjs.setProperty(bjsClass, "anyAutoProp", value.jsObj);
    }

    public static ToyClass1 getBjsObjAutoProp_static() {
        return bjs.getObj(bjs.getProperty(bjsClass, "bjsObjAutoProp"), bjsFactory, ToyClass1.class);
    }

    public static void setBjsObjAutoProp_static(ToyClass1 value) {
        bjs.setProperty(bjsClass, "bjsObjAutoProp", bjs.putObj(value));
    }

    public static Lambda.F1<String, String> getLambdaAutoProp_static() {
        JSReference jsFunc = bjs.getProperty(bjsClass, "lambdaAutoProp");
        return bjs.getFunc(jsFunc, s -> bjs.getString(bjs.funcCall(jsFunc, bjs.putPrimitive(s))));
    }

    public static void setLambdaAutoProp_static(Lambda.F1<String, String> value) {
        FunctionCallback<?> functionCallback = jsReferences -> {
            jsReferences = bjs.ensureArraySize(jsReferences, 1);
            return bjs.putPrimitive(value.apply(bjs.getString(jsReferences[0])));
        };
        bjs.setProperty(bjsClass, "lambdaAutoProp", bjs.putFunc(value, functionCallback));
    }

    public static String[][][] getNativeArrayAutoProp_static() {
        JSReference nativeArrayAutoProp = bjs.getProperty(bjsClass, "nativeArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, bjs::getString, String.class), String[].class), String[][].class);
    }
    public static void setNativeArrayAutoProp_static(String[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, bjs::putPrimitive)));
        bjs.setProperty(bjsClass, "nativeArrayAutoProp", propertyValue);
    }

    public static ToyClass1[][][] getBjsObjArrayAutoProp_static() {
        JSReference nativeArrayAutoProp = bjs.getProperty(bjsClass, "bjsObjArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                        bjs.getArray(r0, r1 ->
                                        bjs.getArray(r1, r2 ->
                                                        bjs.getObj(r2, bjsFactory, ToyClass1.class),
                                                ToyClass1.class),
                                ToyClass1[].class),
                ToyClass1[][].class);
    }
    public static void setBjsObjArrayAutoProp_static(ToyClass1[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, bjs::putObj)));
        bjs.setProperty(bjsClass, "bjsObjArrayAutoProp", propertyValue);
    }

    public static BjsAnyObject[][][] getAnyArrayAutoProp_static() {
        JSReference nativeArrayAutoProp = bjs.getProperty(bjsClass, "anyArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, bjs::getAny, BjsAnyObject.class), BjsAnyObject[].class), BjsAnyObject[][].class);
    }
    public static void setAnyArrayAutoProp_static(BjsAnyObject[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, nv2 ->
                                nv2.jsObj)));
        bjs.setProperty(bjsClass, "anyArrayAutoProp", propertyValue);
    }

    public static Lambda.F1<String, String>[][][] getLambdaArrayAutoProp_static() {
        JSReference nativeArrayAutoProp = bjs.getProperty(bjsClass, "lambdaArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, r2 ->
                                        bjs.getFunc(r2, s -> bjs.getString(bjs.funcCall(r2, bjs.putPrimitive(s)))),
                                Lambda.F1.class), Lambda.F1[].class), Lambda.F1[][].class);
    }
    public static void setLambdaArrayAutoProp_static(Lambda.F1<String, String>[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, nv2 -> {
                            FunctionCallback<?> functionCallback = jsReferences -> {
                                jsReferences = bjs.ensureArraySize(jsReferences, 1);
                                return bjs.putPrimitive(nv2.apply(bjs.getString(jsReferences[0])));
                            };
                            return bjs.putFunc(nv2, functionCallback);
                        })));
        bjs.setProperty(bjsClass, "lambdaArrayAutoProp", propertyValue);
    }

    public static String getProp_static() {
        return bjs.getString(bjs.getProperty(bjsClass, "prop"));
    }
    public static void setProp_static(String value) {
        bjs.setProperty(bjsClass, "prop", bjs.putPrimitive(value));
    }

    // STATIC METHODS

    public static void voidFunc_static() {
        bjs.call(bjsClass, "voidFunc");
    }

    public static void paramsFunc_static(Boolean bool, Date date, Double number, Integer integer, String string,
                                         BjsAnyObject any, ToyClass1 bjsObj, Integer[] array, Lambda.F0<String> lambda) {
        bjs.call(bjsClass, "paramsFunc", bjs.putPrimitive(bool), bjs.putPrimitive(date),
                bjs.putPrimitive(number), bjs.putPrimitive(integer), bjs.putPrimitive(string),
                any.jsObj, bjs.putObj(bjsObj), bjs.putArray(array, bjs::putPrimitive),
                bjs.putFunc(lambda, jsReferences -> bjs.putPrimitive(lambda.apply())));
    }

    public static Boolean boolFunc_static() {
        return bjs.getBoolean(bjs.call(bjsClass, "retValueFunc"));
    }

    public static Date dateFunc_static() {
        return bjs.getDate(bjs.call(bjsClass, "retValueFunc"));
    }

    public static Double floatFunc_static() {
        return bjs.getDouble(bjs.call(bjsClass, "retValueFunc"));
    }

    public static Integer intFunc_static() {
        return bjs.getInteger(bjs.call(bjsClass, "retValueFunc"));
    }

    public static String stringFunc_static() {
        return bjs.getString(bjs.call(bjsClass, "retValueFunc"));
    }

    public static Lambda.F0<Void> lambdaVoidFunc_static(Lambda.F0<Void> lambda) {
        JSReference jsFunc = bjs.call(bjsClass, "lambdaVoidFunc", bjs.putFunc(lambda, jsReferences -> {
            lambda.apply();
            return bjs.jsUndefined();
        }));
        return bjs.getFunc(jsFunc, () -> {
            bjs.funcCall(jsFunc);
            return null;
        });
    }

    public static void lambdaWithParamsFunc_static(Lambda.F4<Integer, String, BjsAnyObject, ToyClass1, String> lambda) {
        bjs.call(bjsClass, "lambdaWithParamsFunc", bjs.putFunc(lambda, jsReferences ->
                bjs.putPrimitive(lambda.apply(
                        bjs.getInteger(jsReferences[0]),
                        bjs.getString(jsReferences[1]),
                        bjs.getAny(jsReferences[2]),
                        bjs.getObj(jsReferences[3], bjsFactory, ToyClass1.class)))));
    }

    public static Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> returningLambdaWithParamsFunc_static() {
        JSReference jsFunc = bjs.call(bjsClass, "returningLambdaWithParamsFunc");

        return bjs.getFunc(jsFunc, (integer, any, toyClass1, array) ->
                bjs.getString(bjs.funcCall(jsFunc,
                        bjs.putPrimitive(integer),
                        any.jsObj,
                        bjs.putObj(toyClass1),
                        bjs.putArray(array, bjs::putPrimitive))));
    }

    // TESTING HELPERS
    public static String getLog_static() {
        return bjs.getString(bjs.getProperty(bjsClass, "log"));
    }
    public static void setLog_static(String value) {
        bjs.setProperty(bjsClass, "log", bjs.putPrimitive(value));
    }

    public String getLog() {
        return bjs.getString(bjsGetProperty("log"));
    }
    public void setLog(String value) {
        bjsSetProperty("log", bjs.putPrimitive(value));
    }

    public static void evalAndSetValue_static(String jsToEval) {
        bjs.call(bjsClass, "setValue", bjs.putPrimitive(jsToEval));
    }
    public void evalAndSetValue(String jsToEval) {
        bjsCall("setValue", bjs.putPrimitive(jsToEval));
    }
}