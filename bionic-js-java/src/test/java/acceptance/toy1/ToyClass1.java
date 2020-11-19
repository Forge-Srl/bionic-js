package acceptance.toy1;

import bionic.js.*;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;

import java.util.Date;

@BjsObjectTypeInfo.BjsModulePath(path = "/src/ToyClass1")
public class ToyClass1 extends BjsObject
{
    // BJS HELPERS
    public static final Bjs.JSReferenceConverter<ToyClass1> bjsFactory = ToyClass1::new;
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(ToyClass1.class).bjsClass();

    public ToyClass1(JSReference jsObject) {
        super(jsObject);
    }

    public ToyClass1(JSReference[] arguments) {
        super(ToyClass1.class, arguments);
    }

    public ToyClass1() {
        super(ToyClass1.class, new JSReference[0]);
    }

    // STATIC PROPERTIES

    public static String getNativeAutoProp() {
        return Bjs.get().getString(Bjs.get().getProperty(bjsClass, "nativeAutoProp"));
    }

    public static void setNativeAutoProp(String value) {
        Bjs.get().setProperty(bjsClass, "nativeAutoProp", Bjs.get().putPrimitive(value));
    }

    public static BjsAnyObject getAnyAutoProp() {
        return Bjs.get().getAny(Bjs.get().getProperty(bjsClass, "anyAutoProp"));
    }

    public static void setAnyAutoProp(BjsAnyObject value) {
        Bjs.get().setProperty(bjsClass, "anyAutoProp", value.jsObj);
    }

    public static ToyClass1 getBjsObjAutoProp() {
        return Bjs.get().getObj(Bjs.get().getProperty(bjsClass, "bjsObjAutoProp"), bjsFactory, ToyClass1.class);
    }

    public static void setBjsObjAutoProp(ToyClass1 value) {
        Bjs.get().setProperty(bjsClass, "bjsObjAutoProp", Bjs.get().putObj(value));
    }

    public static Lambda.F1<String, String> getLambdaAutoProp() {
        JSReference jsFunc = Bjs.get().getProperty(bjsClass, "lambdaAutoProp");
        return Bjs.get().getFunc(jsFunc, s -> Bjs.get().getString(Bjs.get().funcCall(jsFunc, Bjs.get().putPrimitive(s))));
    }

    public static void setLambdaAutoProp(Lambda.F1<String, String> value) {
        FunctionCallback functionCallback = jsReferences -> {
            jsReferences = Bjs.get().ensureArraySize(jsReferences, 1);
            return Bjs.get().putPrimitive(value.apply(Bjs.get().getString(jsReferences[0])));
        };
        Bjs.get().setProperty(bjsClass, "lambdaAutoProp", Bjs.get().putFunc(value, functionCallback));
    }

    public static String[][][] getNativeArrayAutoProp() {
        JSReference nativeArrayAutoProp = Bjs.get().getProperty(bjsClass, "nativeArrayAutoProp");
        return Bjs.get().getArray(nativeArrayAutoProp, r0 ->
                Bjs.get().getArray(r0, r1 ->
                        Bjs.get().getArray(r1, r2 ->
                                Bjs.get().getString(r2), String.class), String[].class), String[][].class);
    }
    public static void setNativeArrayAutoProp(String[][][] value) {
        JSReference propertyValue = Bjs.get().putArray(value, nv0 ->
                Bjs.get().putArray(nv0, nv1 ->
                        Bjs.get().putArray(nv1, nv2 ->
                                Bjs.get().putPrimitive(nv2))));
        Bjs.get().setProperty(bjsClass, "nativeArrayAutoProp", propertyValue);
    }

    public static ToyClass1[][][] getBjsObjArrayAutoProp() {
        JSReference nativeArrayAutoProp = Bjs.get().getProperty(bjsClass, "bjsObjArrayAutoProp");
        return Bjs.get().getArray(nativeArrayAutoProp, r0 ->
                        Bjs.get().getArray(r0, r1 ->
                                        Bjs.get().getArray(r1, r2 ->
                                                        Bjs.get().getObj(r2, bjsFactory, ToyClass1.class),
                                                ToyClass1.class),
                                ToyClass1[].class),
                ToyClass1[][].class);
    }
    public static void setBjsObjArrayAutoProp(ToyClass1[][][] value) {
        JSReference propertyValue = Bjs.get().putArray(value, nv0 ->
                Bjs.get().putArray(nv0, nv1 ->
                        Bjs.get().putArray(nv1, nv2 ->
                                Bjs.get().putObj(nv2))));
        Bjs.get().setProperty(bjsClass, "bjsObjArrayAutoProp", propertyValue);
    }

    public static BjsAnyObject[][][] getAnyArrayAutoProp() {
        JSReference nativeArrayAutoProp = Bjs.get().getProperty(bjsClass, "anyArrayAutoProp");
        return Bjs.get().getArray(nativeArrayAutoProp, r0 ->
                Bjs.get().getArray(r0, r1 ->
                        Bjs.get().getArray(r1, r2 ->
                                Bjs.get().getAny(r2), BjsAnyObject.class), BjsAnyObject[].class), BjsAnyObject[][].class);
    }
    public static void setAnyArrayAutoProp(BjsAnyObject[][][] value) {
        JSReference propertyValue = Bjs.get().putArray(value, nv0 ->
                Bjs.get().putArray(nv0, nv1 ->
                        Bjs.get().putArray(nv1, nv2 ->
                                nv2.jsObj)));
        Bjs.get().setProperty(bjsClass, "anyArrayAutoProp", propertyValue);
    }

    public static Lambda.F1<String, String>[][][] getLambdaArrayAutoProp() {
        JSReference nativeArrayAutoProp = Bjs.get().getProperty(bjsClass, "lambdaArrayAutoProp");
        return Bjs.get().getArray(nativeArrayAutoProp, r0 ->
                Bjs.get().getArray(r0, r1 ->
                        Bjs.get().getArray(r1, r2 ->
                                        Bjs.get().getFunc(r2, s -> Bjs.get().getString(Bjs.get().funcCall(r2, Bjs.get().putPrimitive(s)))),
                                Lambda.F1.class), Lambda.F1[].class), Lambda.F1[][].class);
    }
    public static void setLambdaArrayAutoProp(Lambda.F1<String, String>[][][] value) {
        JSReference propertyValue = Bjs.get().putArray(value, nv0 ->
                Bjs.get().putArray(nv0, nv1 ->
                        Bjs.get().putArray(nv1, nv2 -> {
                            FunctionCallback functionCallback = jsReferences -> {
                                jsReferences = Bjs.get().ensureArraySize(jsReferences, 1);
                                return Bjs.get().putPrimitive(nv2.apply(Bjs.get().getString(jsReferences[0])));
                            };
                            return Bjs.get().putFunc(nv2, functionCallback);
                        })));
        Bjs.get().setProperty(bjsClass, "lambdaArrayAutoProp", propertyValue);
    }

    public static String getProp() {
        return Bjs.get().getString(Bjs.get().getProperty(bjsClass, "prop"));
    }
    public static void setProp(String value) {
        Bjs.get().setProperty(bjsClass, "prop", Bjs.get().putPrimitive(value));
    }

    // STATIC METHODS

    public static void voidFunc() {
        Bjs.get().call(bjsClass, "voidFunc");
    }

    public static void paramsFunc(Boolean bool, Date date, Double number, Integer integer, String string,
                                  BjsAnyObject any, ToyClass1 bjsObj, Integer[] array, Lambda.F0<String> lambda) {
        Bjs.get().call(bjsClass, "paramsFunc", Bjs.get().putPrimitive(bool), Bjs.get().putPrimitive(date),
                Bjs.get().putPrimitive(number), Bjs.get().putPrimitive(integer), Bjs.get().putPrimitive(string),
                any.jsObj, Bjs.get().putObj(bjsObj), Bjs.get().putArray(array, i -> Bjs.get().putPrimitive(i)),
                Bjs.get().putFunc(lambda, jsReferences -> Bjs.get().putPrimitive(lambda.apply())));
    }

    public static Boolean boolFunc() {
        return Bjs.get().getBoolean(Bjs.get().call(bjsClass, "retValueFunc"));
    }

    public static Date dateFunc() {
        return Bjs.get().getDate(Bjs.get().call(bjsClass, "retValueFunc"));
    }

    public static Double floatFunc() {
        return Bjs.get().getDouble(Bjs.get().call(bjsClass, "retValueFunc"));
    }

    public static Integer intFunc() {
        return Bjs.get().getInteger(Bjs.get().call(bjsClass, "retValueFunc"));
    }

    public static String stringFunc() {
        return Bjs.get().getString(Bjs.get().call(bjsClass, "retValueFunc"));
    }

    public static Lambda.F0<Void> lambdaVoidFunc(Lambda.F0<Void> lambda) {
        JSReference jsFunc = Bjs.get().call(bjsClass, "lambdaVoidFunc", Bjs.get().putFunc(lambda, jsReferences -> {
            lambda.apply();
            return Bjs.get().jsUndefined;
        }));
        return Bjs.get().getFunc(jsFunc, () -> {
            Bjs.get().funcCall(jsFunc);
            return null;
        });
    }

    public static void lambdaWithParamsFunc(Lambda.F4<Integer, String, BjsAnyObject, ToyClass1, String> lambda) {
        Bjs.get().call(bjsClass, "lambdaWithParamsFunc", Bjs.get().putFunc(lambda, jsReferences ->
                Bjs.get().putPrimitive(lambda.apply(
                        Bjs.get().getInteger(jsReferences[0]),
                        Bjs.get().getString(jsReferences[1]),
                        Bjs.get().getAny(jsReferences[2]),
                        Bjs.get().getObj(jsReferences[3], bjsFactory, ToyClass1.class)))));
    }

    public static Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> returningLambdaWithParamsFunc() {
        JSReference jsFunc = Bjs.get().call(bjsClass, "returningLambdaWithParamsFunc");

        return Bjs.get().getFunc(jsFunc, (integer, any, toyClass1, array) ->
                Bjs.get().getString(Bjs.get().funcCall(jsFunc,
                        Bjs.get().putPrimitive(integer),
                        any.jsObj,
                        Bjs.get().putObj(toyClass1),
                        Bjs.get().putArray(array, nativeValue -> Bjs.get().putPrimitive(nativeValue)))));
    }

    // TESTING HELPERS
    public static String getLog_static() {
        return Bjs.get().getString(Bjs.get().getProperty(bjsClass, "log"));
    }
    public static void setLog_static(String value) {
        Bjs.get().setProperty(bjsClass, "log", Bjs.get().putPrimitive(value));
    }

    public String getLog() {
        return Bjs.get().getString(bjsGetProperty("log"));
    }
    public void setLog(String value) {
        bjsSetProperty("log", Bjs.get().putPrimitive(value));
    }

    public static void evalAndSetValue_static(String jsToEval) {
        Bjs.get().call(bjsClass, "setValue", Bjs.get().putPrimitive(jsToEval));
    }
    public void evalAndSetValue(String jsToEval) {
        bjsCall("setValue", Bjs.get().putPrimitive(jsToEval));
    }
}