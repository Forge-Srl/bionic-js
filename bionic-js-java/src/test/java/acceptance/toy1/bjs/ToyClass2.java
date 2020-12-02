package acceptance.toy1.bjs;

import bionic.js.*;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.strategy.FunctionCallback;

import java.util.Date;

@BjsTypeInfo.BjsLocation(project = "TestProject", module = "ToyClass2")
public class ToyClass2 extends ToyClass1
{
    // BJS HELPERS
    public static final Bjs.JSReferenceConverter<ToyClass2> bjsFactory = ToyClass2::new;
    public static final Bjs bjs = BjsObjectTypeInfo.get(ToyClass2.class).bjsLocator.get();
    private static final JSReference bjsClass = BjsObjectTypeInfo.get(ToyClass2.class).bjsClass();

    protected <T extends BjsObject> ToyClass2(Class<T> type, JSReference jsObject) {
        super(type, jsObject);
    }

    protected <T extends BjsObject> ToyClass2(Class<T> type, JSReference[] arguments) {
        super(type, arguments);
    }

    public ToyClass2(JSReference jsObject) {
        this(ToyClass2.class, jsObject);
    }

    public ToyClass2(JSReference[] arguments) {
        this(ToyClass2.class, arguments);
    }

    public ToyClass2(Boolean bool) {
        this(new JSReference[]{bjs.putPrimitive(bool)});
    }

    // INSTANCE PROPERTIES

    public String nativeAutoProp() {
        return bjs.getString(bjsGetProperty("nativeAutoProp"));
    }

    public void nativeAutoProp(String value) {
        bjsSetProperty("nativeAutoProp", bjs.putPrimitive(value));
    }

    public BjsAnyObject anyAutoProp() {
        return bjs.getAny(bjsGetProperty("anyAutoProp"));
    }

    public void anyAutoProp(BjsAnyObject value) {
        bjsSetProperty("anyAutoProp", value.jsObj);
    }

    public ToyClass2 bjsObjAutoProp() {
        return bjs.getObj(bjsGetProperty("bjsObjAutoProp"), bjsFactory, ToyClass2.class);
    }

    public void bjsObjAutoProp(ToyClass2 value) {
        bjsSetProperty("bjsObjAutoProp", bjs.putObj(value));
    }

    public Lambda.F1<String, String> lambdaAutoProp() {
        JSReference jsFunc = bjsGetProperty("lambdaAutoProp");
        return bjs.getFunc(jsFunc, s -> bjs.getString(bjs.funcCall(jsFunc, bjs.putPrimitive(s))));
    }

    public void lambdaAutoProp(Lambda.F1<String, String> value) {
        FunctionCallback<?> functionCallback = jsReferences -> {
            jsReferences = bjs.ensureArraySize(jsReferences, 1);
            return bjs.putPrimitive(value.apply(bjs.getString(jsReferences[0])));
        };
        bjsSetProperty("lambdaAutoProp", bjs.putFunc(value, functionCallback));
    }

    public String[][][] nativeArrayAutoProp() {
        JSReference nativeArrayAutoProp = bjsGetProperty("nativeArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, bjs::getString, String.class), String[].class), String[][].class);
    }
    public void nativeArrayAutoProp(String[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, bjs::putPrimitive)));
        bjsSetProperty("nativeArrayAutoProp", propertyValue);
    }

    public ToyClass2[][][] bjsObjArrayAutoProp() {
        JSReference nativeArrayAutoProp = bjsGetProperty("bjsObjArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                        bjs.getArray(r0, r1 ->
                                        bjs.getArray(r1, r2 ->
                                                        bjs.getObj(r2, bjsFactory, ToyClass2.class),
                                                ToyClass2.class),
                                ToyClass2[].class),
                ToyClass2[][].class);
    }
    public void bjsObjArrayAutoProp(ToyClass2[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, bjs::putObj)));
        bjsSetProperty("bjsObjArrayAutoProp", propertyValue);
    }

    public BjsAnyObject[][][] anyArrayAutoProp() {
        JSReference nativeArrayAutoProp = bjsGetProperty("anyArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, bjs::getAny, BjsAnyObject.class), BjsAnyObject[].class), BjsAnyObject[][].class);
    }
    public void anyArrayAutoProp(BjsAnyObject[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, nv2 ->
                                nv2.jsObj)));
        bjsSetProperty("anyArrayAutoProp", propertyValue);
    }

    public Lambda.F1<String, String>[][][] lambdaArrayAutoProp() {
        JSReference nativeArrayAutoProp = bjsGetProperty("lambdaArrayAutoProp");
        return bjs.getArray(nativeArrayAutoProp, r0 ->
                bjs.getArray(r0, r1 ->
                        bjs.getArray(r1, r2 ->
                                        bjs.getFunc(r2, s -> bjs.getString(bjs.funcCall(r2, bjs.putPrimitive(s)))),
                                Lambda.F1.class), Lambda.F1[].class), Lambda.F1[][].class);
    }
    public void lambdaArrayAutoProp(Lambda.F1<String, String>[][][] value) {
        JSReference propertyValue = bjs.putArray(value, nv0 ->
                bjs.putArray(nv0, nv1 ->
                        bjs.putArray(nv1, nv2 -> {
                            FunctionCallback<?> functionCallback = jsReferences -> {
                                jsReferences = bjs.ensureArraySize(jsReferences, 1);
                                return bjs.putPrimitive(nv2.apply(bjs.getString(jsReferences[0])));
                            };
                            return bjs.putFunc(nv2, functionCallback);
                        })));
        bjsSetProperty("lambdaArrayAutoProp", propertyValue);
    }

    public String prop() {
        return bjs.getString(bjsGetProperty("prop"));
    }
    public void prop(String value) {
        bjsSetProperty("prop", bjs.putPrimitive(value));
    }

    // INSTANCE METHODS

    public void voidFunc() {
        bjsCall("voidFunc");
    }

    public void paramsFunc(Boolean bool, Date date, Double number, Integer integer, String string,
                                  BjsAnyObject any, ToyClass2 bjsObj, Integer[] array, Lambda.F0<String> lambda) {
        bjsCall("paramsFunc", bjs.putPrimitive(bool), bjs.putPrimitive(date),
                bjs.putPrimitive(number), bjs.putPrimitive(integer), bjs.putPrimitive(string),
                any.jsObj, bjs.putObj(bjsObj), bjs.putArray(array, bjs::putPrimitive),
                bjs.putFunc(lambda, jsReferences -> bjs.putPrimitive(lambda.apply())));
    }

    public Boolean boolFunc() {
        return bjs.getBoolean(bjsCall("retValueFunc"));
    }

    public Date dateFunc() {
        return bjs.getDate(bjsCall("retValueFunc"));
    }

    public Double floatFunc() {
        return bjs.getDouble(bjsCall("retValueFunc"));
    }

    public Integer intFunc() {
        return bjs.getInteger(bjsCall("retValueFunc"));
    }

    public String stringFunc() {
        return bjs.getString(bjsCall("retValueFunc"));
    }

    public Lambda.F0<Void> lambdaVoidFunc(Lambda.F0<Void> lambda) {
        JSReference jsFunc = bjsCall("lambdaVoidFunc", bjs.putFunc(lambda, jsReferences -> {
            lambda.apply();
            return bjs.jsUndefined();
        }));
        return bjs.getFunc(jsFunc, () -> {
            bjs.funcCall(jsFunc);
            return null;
        });
    }

    public void lambdaWithParamsFunc(Lambda.F4<Integer, String, BjsAnyObject, ToyClass2, String> lambda) {
        bjsCall("lambdaWithParamsFunc", bjs.putFunc(lambda, jsReferences ->
                bjs.putPrimitive(lambda.apply(
                        bjs.getInteger(jsReferences[0]),
                        bjs.getString(jsReferences[1]),
                        bjs.getAny(jsReferences[2]),
                        bjs.getObj(jsReferences[3], bjsFactory, ToyClass2.class)))));
    }

    public Lambda.F4<Integer, BjsAnyObject, ToyClass2, Integer[], String> returningLambdaWithParamsFunc() {
        JSReference jsFunc = bjsCall("returningLambdaWithParamsFunc");

        return bjs.getFunc(jsFunc, (integer, any, toyClass1, array) ->
                bjs.getString(bjs.funcCall(jsFunc,
                        bjs.putPrimitive(integer),
                        any.jsObj,
                        bjs.putObj(toyClass1),
                        bjs.putArray(array, bjs::putPrimitive))));
    }
}