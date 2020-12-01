package acceptance.toy1;

import bionic.js.Bjs;
import bionic.js.BjsAnyObject;
import bionic.js.Lambda;
import jjbridge.api.value.JSType;
import jjbridge.engine.v8.V8Engine;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class ToyClass1Test
{
    private Date testDate;
    private Double testDateTimestamp;
    private ToyClass1 bjsObj;

    @BeforeAll
    public static void beforeClass()
    {
        Bjs.setDefaultRuntime(new V8Engine().newRuntime());
    }

    @BeforeEach
    public void before()
    {
        testDateTimestamp = 472867200000D;
        testDate = Date.from(Instant.ofEpochMilli(testDateTimestamp.longValue()));
        bjsObj = new ToyClass1();
        bjsObj.setLog("any object");
        ToyClass1.evalAndSetValue_static("undefined");
    }

    @Test
    public void testNativeAutoProp()
    {
        assertNull(ToyClass1.getNativeAutoProp_static());

        ToyClass1.setNativeAutoProp_static("1984!");
        assertEquals("1984!", ToyClass1.getNativeAutoProp_static());

        ToyClass1.setNativeAutoProp_static(null);
        assertNull(ToyClass1.getNativeAutoProp_static());
    }

    @Test
    public void testAnyAutoProp() {
        assertEquals(ToyClass1.getAnyAutoProp_static().jsObj.getActualType(), JSType.Undefined);

        ToyClass1.setAnyAutoProp_static(new BjsAnyObject(bjsObj));
        assertEquals("any object", ToyClass1.getAnyAutoProp_static().getObject(ToyClass1.bjsFactory, ToyClass1.class).getLog());
    }

    @Test
    public void testBjsObjAutoProp() {
        assertNull(ToyClass1.getBjsObjAutoProp_static());

        ToyClass1.setBjsObjAutoProp_static(bjsObj);
        assertEquals("any object", ToyClass1.getBjsObjAutoProp_static().getLog());
    }

    @Test
    public void testLambdaAutoProp() {
        assertNull(ToyClass1.getLambdaAutoProp_static());

        ToyClass1.setLambdaAutoProp_static(string -> string == null ? "null!" : string + " 1984!");
        assertEquals("null!", ToyClass1.getLambdaAutoProp_static().apply(null));
        assertEquals("W 1984!", ToyClass1.getLambdaAutoProp_static().apply("W"));

        ToyClass1.setLambdaAutoProp_static(null);
        assertNull(ToyClass1.getLambdaAutoProp_static());

        ToyClass1.setLambdaAutoProp_static(string -> null);
        assertNull(ToyClass1.getLambdaAutoProp_static().apply("x"));
    }

    @Test
    public void testLambdaAutoProp_putNullToJs() {
        String nullTest = "(this.lambdaAutoProp() === null)";

        ToyClass1.setLambdaAutoProp_static(string -> "hey");
        ToyClass1.evalAndSetValue_static(nullTest);
        assertFalse(ToyClass1.boolFunc_static());

        ToyClass1.setLambdaAutoProp_static(string -> null);
        ToyClass1.evalAndSetValue_static(nullTest);
        assertTrue(ToyClass1.boolFunc_static());
    }

    @Test
    public void testNativeArrayAutoProp() {
        assertNull(ToyClass1.getNativeArrayAutoProp_static());

        ToyClass1.setNativeArrayAutoProp_static(new String[][][]{{{"a", "b"}}});
        assertArrayEquals(new String[][][]{{{"a", "b"}}}, ToyClass1.getNativeArrayAutoProp_static());

        ToyClass1.setNativeArrayAutoProp_static(new String[][][]{{{}, {}}});
        assertArrayEquals(new String[][][]{{{}, {}}}, ToyClass1.getNativeArrayAutoProp_static());

        ToyClass1.setNativeArrayAutoProp_static(new String[][][]{{}, {}});
        assertArrayEquals(new String[][][]{{}, {}}, ToyClass1.getNativeArrayAutoProp_static());

        ToyClass1.setNativeArrayAutoProp_static(new String[][][]{});
        assertArrayEquals(new String[][][]{}, ToyClass1.getNativeArrayAutoProp_static());

        ToyClass1.setNativeArrayAutoProp_static(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}});
        assertArrayEquals(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}}, ToyClass1.getNativeArrayAutoProp_static());
    }

    @Test
    public void testBjsObjArrayAutoProp() {
        assertNull(ToyClass1.getBjsObjArrayAutoProp_static());

        ToyClass1.setBjsObjArrayAutoProp_static(new ToyClass1[][][]{{{bjsObj}}});
        assertArrayEquals(new ToyClass1[][][]{{{bjsObj}}}, ToyClass1.getBjsObjArrayAutoProp_static());

        ToyClass1.setBjsObjArrayAutoProp_static(new ToyClass1[][][]{{{}, {}}});
        assertArrayEquals(new ToyClass1[][][]{{{}, {}}}, ToyClass1.getBjsObjArrayAutoProp_static());

        ToyClass1.setBjsObjArrayAutoProp_static(new ToyClass1[][][]{{}, {}});
        assertArrayEquals(new ToyClass1[][][]{{}, {}}, ToyClass1.getBjsObjArrayAutoProp_static());

        ToyClass1.setBjsObjArrayAutoProp_static(new ToyClass1[][][]{});
        assertArrayEquals(new ToyClass1[][][]{}, ToyClass1.getBjsObjArrayAutoProp_static());

        ToyClass1.setBjsObjArrayAutoProp_static(new ToyClass1[][][]{null, {null}, {{null}}, {{bjsObj, null}, null}});
        assertArrayEquals(new ToyClass1[][][]{null, {null}, {{null}}, {{bjsObj, null}, null}}, ToyClass1.getBjsObjArrayAutoProp_static());
    }

    @Test
    public void testAnyArrayAutoProp() {
        assertNull(ToyClass1.getAnyArrayAutoProp_static());

        BjsAnyObject anyObj = new BjsAnyObject(bjsObj);

        ToyClass1.setAnyArrayAutoProp_static(new BjsAnyObject[][][]{{{anyObj}}});
        assertEquals("any object", ToyClass1.getAnyArrayAutoProp_static()[0][0][0].getObject(ToyClass1.bjsFactory, ToyClass1.class).getLog());

        ToyClass1.setAnyArrayAutoProp_static(new BjsAnyObject[][][]{{{}}});
        assertEquals(0, ToyClass1.getAnyArrayAutoProp_static()[0][0].length);
    }

    @Test
    public void testLambdaArrayAutoProp() {
        assertNull(ToyClass1.getLambdaArrayAutoProp_static());

        Lambda.F1<String, String> lambda1a = s -> (s != null ? s : "") + "-1a";
        Lambda.F1<String, String> lambda1b = s -> (s != null ? s : "") + "-1b";
        Lambda.F1<String, String> lambda2a = s -> (s != null ? s : "") + "-2a";

        ToyClass1.setLambdaArrayAutoProp_static(new Lambda.F1[][][]{{{lambda1a, lambda1b}, {lambda2a, null}}});

        assertEquals("test-1a", ToyClass1.getLambdaArrayAutoProp_static()[0][0][0].apply("test"));
        assertEquals("test-1b", ToyClass1.getLambdaArrayAutoProp_static()[0][0][1].apply("test"));
        assertEquals("test-2a", ToyClass1.getLambdaArrayAutoProp_static()[0][1][0].apply("test"));
        assertNull(ToyClass1.getLambdaArrayAutoProp_static()[0][1][1]);

        ToyClass1.setLambdaArrayAutoProp_static(new Lambda.F1[][][]{{{}}});
        assertEquals(0, ToyClass1.getLambdaArrayAutoProp_static()[0][0].length);
    }

    @Test
    public void testProp() {
        assertEquals("1984!", ToyClass1.getProp_static());

        ToyClass1.setProp_static("test value");
        assertEquals("test value", ToyClass1.getProp_static());

        ToyClass1.setProp_static(null);
        assertEquals("1984!", ToyClass1.getProp_static());
    }

    @Test
    public void testVoidFunc() {
        ToyClass1.voidFunc_static();
        assertEquals("called voidFunc", ToyClass1.getLog_static());
    }

    @Test
    public void testParamsFunc() {
        ToyClass1.paramsFunc_static(true, testDate, 01.984, 1984, "1984", new BjsAnyObject(bjsObj), bjsObj,
                new Integer[]{1,2,3}, () -> "lambda return value");
        assertEquals("called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value", ToyClass1.getLog_static());
    }

    @Test
    public void testParamsFunc_null() {
        ToyClass1.paramsFunc_static(null, null, null, null, null, ToyClass1.bjs.anyNull(), null, null, null);
        assertEquals("called paramsFunc with params: null, null, null, null, null, null, null, null, null", ToyClass1.getLog_static());
    }

    @Test
    public void testBoolFunc() {
        assertNull(ToyClass1.boolFunc_static());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.boolFunc_static());

        ToyClass1.evalAndSetValue_static("false");
        assertFalse(ToyClass1.boolFunc_static());

        ToyClass1.evalAndSetValue_static("true");
        assertTrue(ToyClass1.boolFunc_static());

        ToyClass1.evalAndSetValue_static("!!1");
        assertTrue(ToyClass1.boolFunc_static());
    }

    @Test
    public void testDateFunc() {
        assertNull(ToyClass1.dateFunc_static());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.dateFunc_static());

        ToyClass1.evalAndSetValue_static("new Date(" + testDateTimestamp + ")");
        assertEquals(testDate, ToyClass1.dateFunc_static());
    }

    @Test
    public void testFloatFunc() {
        assertNull(ToyClass1.floatFunc_static());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.floatFunc_static());

        ToyClass1.evalAndSetValue_static(".1984");
        assertEquals(0.1984, ToyClass1.floatFunc_static(), 0.0);

        ToyClass1.evalAndSetValue_static("123456789.123456789");
        assertEquals(123456789.123456789, ToyClass1.floatFunc_static(), 0.0);
    }

    @Test
    public void testIntFunc() {
        assertNull(ToyClass1.intFunc_static());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.intFunc_static());

        ToyClass1.evalAndSetValue_static("1984");
        assertEquals(1984, (long) ToyClass1.intFunc_static());

        ToyClass1.evalAndSetValue_static("1234567890");
        assertEquals(1234567890, (long) ToyClass1.intFunc_static());
    }

    @Test
    public void testStringFunc() {
        assertNull(ToyClass1.stringFunc_static());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.stringFunc_static());

        ToyClass1.evalAndSetValue_static("'hello 84! 👋'");
        assertEquals("hello 84! 👋", ToyClass1.stringFunc_static());
    }

    @Test
    public void testLambdaVoidFunc() {
        Boolean[] check = new Boolean[] {false};

        Lambda.F0<Void> jsLambda = ToyClass1.lambdaVoidFunc_static(() -> {
           assertEquals("calling lambda", ToyClass1.getLog_static());
           check[0] = true;
           return null;
        });

        assertEquals("called lambdaVoidFunc", ToyClass1.getLog_static());
        jsLambda.apply();
        assertTrue(check[0]);

        Lambda.F0<Void> nilLambda = ToyClass1.lambdaVoidFunc_static(null);
        assertNull(nilLambda);
    }

    @Test
    public void testLambdaWithParamsFunc() {
        ToyClass1.lambdaWithParamsFunc_static((integer, nullStr, any, obj) -> {
            assertEquals("called lambdaWithParamsFunc", ToyClass1.getLog_static());
            assertEquals(1984, (int) integer);
            assertNull(nullStr);
            assertEquals("hello 84", any.getObject(ToyClass1.bjsFactory, ToyClass1.class).getLog());
            assertEquals("hello 84", obj.getLog());
            return "1984!";
        });
        assertEquals("called lambda with result: 1984!", ToyClass1.getLog_static());
    }

    @Test
    public void testReturningLambdaWithParamsFunc() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> lambda = ToyClass1.returningLambdaWithParamsFunc_static();
        assertEquals("called returningLambdaWithParamsFunc", ToyClass1.getLog_static());
        String lambdaRetValue = lambda.apply(1984, new BjsAnyObject(bjsObj), bjsObj, new Integer[]{1,2,3});
        assertEquals("called returned lambda with params: 1984, any object, any object, [1,2,3]", ToyClass1.getLog_static());
        assertEquals("lambda returning value", lambdaRetValue);
    }

    @Test
    public void testReturningLambdaWithParamsFunc_null() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> lambda = ToyClass1.returningLambdaWithParamsFunc_static();
        assertEquals("called returningLambdaWithParamsFunc", ToyClass1.getLog_static());
        String lambdaRetValue = lambda.apply(null, ToyClass1.bjs.anyNull(), null, null);
        assertEquals("called returned lambda with params: null, null, null, null", ToyClass1.getLog_static());
        assertEquals("lambda returning value", lambdaRetValue);
    }
}
