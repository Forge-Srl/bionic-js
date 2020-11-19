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
        Bjs.setBundle(ToyClass1Test.class, "test");
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
        assertNull(ToyClass1.getNativeAutoProp());

        ToyClass1.setNativeAutoProp("1984!");
        assertEquals("1984!", ToyClass1.getNativeAutoProp());

        ToyClass1.setNativeAutoProp(null);
        assertNull(ToyClass1.getNativeAutoProp());
    }

    @Test
    public void testAnyAutoProp() {
        assertEquals(ToyClass1.getAnyAutoProp().jsObj.getActualType(), JSType.Undefined);

        ToyClass1.setAnyAutoProp(new BjsAnyObject(bjsObj));
        assertEquals("any object", ToyClass1.getAnyAutoProp().getObject(ToyClass1.bjsFactory, ToyClass1.class).getLog());
    }

    @Test
    public void testBjsObjAutoProp() {
        assertNull(ToyClass1.getBjsObjAutoProp());

        ToyClass1.setBjsObjAutoProp(bjsObj);
        assertEquals("any object", ToyClass1.getBjsObjAutoProp().getLog());
    }

    @Test
    public void testLambdaAutoProp() {
        assertNull(ToyClass1.getLambdaAutoProp());

        ToyClass1.setLambdaAutoProp(string -> string == null ? "null!" : string + " 1984!");
        assertEquals("null!", ToyClass1.getLambdaAutoProp().apply(null));
        assertEquals("W 1984!", ToyClass1.getLambdaAutoProp().apply("W"));

        ToyClass1.setLambdaAutoProp(null);
        assertNull(ToyClass1.getLambdaAutoProp());

        ToyClass1.setLambdaAutoProp(string -> null);
        assertNull(ToyClass1.getLambdaAutoProp().apply("x"));
    }

    @Test
    public void testLambdaAutoProp_putNullToJs() {
        String nullTest = "(this.lambdaAutoProp() === null)";

        ToyClass1.setLambdaAutoProp(string -> "hey");
        ToyClass1.evalAndSetValue_static(nullTest);
        assertFalse(ToyClass1.boolFunc());

        ToyClass1.setLambdaAutoProp(string -> null);
        ToyClass1.evalAndSetValue_static(nullTest);
        assertTrue(ToyClass1.boolFunc());
    }

    @Test
    public void testNativeArrayAutoProp() {
        assertNull(ToyClass1.getNativeArrayAutoProp());

        ToyClass1.setNativeArrayAutoProp(new String[][][]{{{"a", "b"}}});
        assertArrayEquals(new String[][][]{{{"a", "b"}}}, ToyClass1.getNativeArrayAutoProp());

        ToyClass1.setNativeArrayAutoProp(new String[][][]{{{}, {}}});
        assertArrayEquals(new String[][][]{{{}, {}}}, ToyClass1.getNativeArrayAutoProp());

        ToyClass1.setNativeArrayAutoProp(new String[][][]{{}, {}});
        assertArrayEquals(new String[][][]{{}, {}}, ToyClass1.getNativeArrayAutoProp());

        ToyClass1.setNativeArrayAutoProp(new String[][][]{});
        assertArrayEquals(new String[][][]{}, ToyClass1.getNativeArrayAutoProp());

        ToyClass1.setNativeArrayAutoProp(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}});
        assertArrayEquals(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}}, ToyClass1.getNativeArrayAutoProp());
    }

    @Test
    public void testBjsObjArrayAutoProp() {
        assertNull(ToyClass1.getBjsObjArrayAutoProp());

        ToyClass1.setBjsObjArrayAutoProp(new ToyClass1[][][]{{{bjsObj}}});
        assertArrayEquals(new ToyClass1[][][]{{{bjsObj}}}, ToyClass1.getBjsObjArrayAutoProp());

        ToyClass1.setBjsObjArrayAutoProp(new ToyClass1[][][]{{{}, {}}});
        assertArrayEquals(new ToyClass1[][][]{{{}, {}}}, ToyClass1.getBjsObjArrayAutoProp());

        ToyClass1.setBjsObjArrayAutoProp(new ToyClass1[][][]{{}, {}});
        assertArrayEquals(new ToyClass1[][][]{{}, {}}, ToyClass1.getBjsObjArrayAutoProp());

        ToyClass1.setBjsObjArrayAutoProp(new ToyClass1[][][]{});
        assertArrayEquals(new ToyClass1[][][]{}, ToyClass1.getBjsObjArrayAutoProp());

        ToyClass1.setBjsObjArrayAutoProp(new ToyClass1[][][]{null, {null}, {{null}}, {{bjsObj, null}, null}});
        assertArrayEquals(new ToyClass1[][][]{null, {null}, {{null}}, {{bjsObj, null}, null}}, ToyClass1.getBjsObjArrayAutoProp());
    }

    @Test
    public void testAnyArrayAutoProp() {
        assertNull(ToyClass1.getAnyArrayAutoProp());

        BjsAnyObject anyObj = new BjsAnyObject(bjsObj);

        ToyClass1.setAnyArrayAutoProp(new BjsAnyObject[][][]{{{anyObj}}});
        assertEquals("any object", ToyClass1.getAnyArrayAutoProp()[0][0][0].getObject(ToyClass1.bjsFactory, ToyClass1.class).getLog());

        ToyClass1.setAnyArrayAutoProp(new BjsAnyObject[][][]{{{}}});
        assertEquals(0, ToyClass1.getAnyArrayAutoProp()[0][0].length);
    }

    @Test
    public void testLambdaArrayAutoProp() {
        assertNull(ToyClass1.getLambdaArrayAutoProp());

        Lambda.F1<String, String> lambda1a = s -> (s != null ? s : "") + "-1a";
        Lambda.F1<String, String> lambda1b = s -> (s != null ? s : "") + "-1b";
        Lambda.F1<String, String> lambda2a = s -> (s != null ? s : "") + "-2a";

        ToyClass1.setLambdaArrayAutoProp(new Lambda.F1[][][]{{{lambda1a, lambda1b}, {lambda2a, null}}});

        assertEquals("test-1a", ToyClass1.getLambdaArrayAutoProp()[0][0][0].apply("test"));
        assertEquals("test-1b", ToyClass1.getLambdaArrayAutoProp()[0][0][1].apply("test"));
        assertEquals("test-2a", ToyClass1.getLambdaArrayAutoProp()[0][1][0].apply("test"));
        assertNull(ToyClass1.getLambdaArrayAutoProp()[0][1][1]);

        ToyClass1.setLambdaArrayAutoProp(new Lambda.F1[][][]{{{}}});
        assertEquals(0, ToyClass1.getLambdaArrayAutoProp()[0][0].length);
    }

    @Test
    public void testProp() {
        assertEquals("1984!", ToyClass1.getProp());

        ToyClass1.setProp("test value");
        assertEquals("test value", ToyClass1.getProp());

        ToyClass1.setProp(null);
        assertEquals("1984!", ToyClass1.getProp());
    }

    @Test
    public void testVoidFunc() {
        ToyClass1.voidFunc();
        assertEquals("called voidFunc", ToyClass1.getLog_static());
    }

    @Test
    public void testParamsFunc() {
        ToyClass1.paramsFunc(true, testDate, 01.984, 1984, "1984", new BjsAnyObject(bjsObj), bjsObj,
                new Integer[]{1,2,3}, () -> "lambda return value");
        assertEquals("called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value", ToyClass1.getLog_static());
    }

    @Test
    public void testParamsFunc_null() {
        ToyClass1.paramsFunc(null, null, null, null, null, new BjsAnyObject(Bjs.get().jsNull), null, null, null);
        assertEquals("called paramsFunc with params: null, null, null, null, null, null, null, null, null", ToyClass1.getLog_static());
    }

    @Test
    public void testBoolFunc() {
        assertNull(ToyClass1.boolFunc());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.boolFunc());

        ToyClass1.evalAndSetValue_static("false");
        assertFalse(ToyClass1.boolFunc());

        ToyClass1.evalAndSetValue_static("true");
        assertTrue(ToyClass1.boolFunc());

        ToyClass1.evalAndSetValue_static("!!1");
        assertTrue(ToyClass1.boolFunc());
    }

    @Test
    public void testDateFunc() {
        assertNull(ToyClass1.dateFunc());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.dateFunc());

        ToyClass1.evalAndSetValue_static("new Date(" + testDateTimestamp + ")");
        assertEquals(testDate, ToyClass1.dateFunc());
    }

    @Test
    public void testFloatFunc() {
        assertNull(ToyClass1.floatFunc());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.floatFunc());

        ToyClass1.evalAndSetValue_static(".1984");
        assertEquals(0.1984, ToyClass1.floatFunc(), 0.0);

        ToyClass1.evalAndSetValue_static("123456789.123456789");
        assertEquals(123456789.123456789, ToyClass1.floatFunc(), 0.0);
    }

    @Test
    public void testIntFunc() {
        assertNull(ToyClass1.intFunc());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.intFunc());

        ToyClass1.evalAndSetValue_static("1984");
        assertEquals(1984, (long) ToyClass1.intFunc());

        ToyClass1.evalAndSetValue_static("1234567890");
        assertEquals(1234567890, (long) ToyClass1.intFunc());
    }

    @Test
    public void testStringFunc() {
        assertNull(ToyClass1.stringFunc());
        assertEquals("called retValueFunc", ToyClass1.getLog_static());

        ToyClass1.evalAndSetValue_static("null");
        assertNull(ToyClass1.stringFunc());

        ToyClass1.evalAndSetValue_static("'hello 84! 👋'");
        assertEquals("hello 84! 👋", ToyClass1.stringFunc());
    }

    @Test
    public void testLambdaVoidFunc() {
        Boolean[] check = new Boolean[] {false};

        Lambda.F0<Void> jsLambda = ToyClass1.lambdaVoidFunc(() -> {
           assertEquals("calling lambda", ToyClass1.getLog_static());
           check[0] = true;
           return null;
        });

        assertEquals("called lambdaVoidFunc", ToyClass1.getLog_static());
        jsLambda.apply();
        assertTrue(check[0]);

        Lambda.F0<Void> nilLambda = ToyClass1.lambdaVoidFunc(null);
        assertNull(nilLambda);
    }

    @Test
    public void testLambdaWithParamsFunc() {
        ToyClass1.lambdaWithParamsFunc((integer, nullStr, any, obj) -> {
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
        Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> lambda = ToyClass1.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", ToyClass1.getLog_static());
        String lambdaRetValue = lambda.apply(1984, new BjsAnyObject(bjsObj), bjsObj, new Integer[]{1,2,3});
        assertEquals("called returned lambda with params: 1984, any object, any object, [1,2,3]", ToyClass1.getLog_static());
        assertEquals("lambda returning value", lambdaRetValue);
    }

    @Test
    public void testReturningLambdaWithParamsFunc_null() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass1, Integer[], String> lambda = ToyClass1.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", ToyClass1.getLog_static());
        String lambdaRetValue = lambda.apply(null, new BjsAnyObject(Bjs.get().jsNull), null, null);
        assertEquals("called returned lambda with params: null, null, null, null", ToyClass1.getLog_static());
        assertEquals("lambda returning value", lambdaRetValue);
    }
}
