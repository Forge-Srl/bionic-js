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

public class ToyClass2Test
{
    private Date testDate;
    private Double testDateTimestamp;
    private ToyClass2 toyObj;
    private ToyClass2 toy;

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
        toyObj = new ToyClass2(false);
        toyObj.setLog("any object");
        
        toy = new ToyClass2(false);
        assertEquals("called constructor without params", toy.getLog());
    }

    @Test
    public void testConstructorParam() {
        toy = new ToyClass2(true);
        assertEquals("called constructor with params: true", toy.getLog());
    }

    @Test
    public void testConstructorNullParam() {
        toy = new ToyClass2((Boolean) null);
        assertEquals("called constructor without params", toy.getLog());
    }

    @Test
    public void testNativeAutoProp()
    {
        assertNull(toy.getNativeAutoProp());

        toy.setNativeAutoProp("1984!");
        assertEquals("1984!", toy.getNativeAutoProp());

        toy.setNativeAutoProp(null);
        assertNull(toy.getNativeAutoProp());
    }

    @Test
    public void testAnyAutoProp() {
        assertEquals(toy.getAnyAutoProp().jsObj.getActualType(), JSType.Undefined);

        toy.setAnyAutoProp(new BjsAnyObject(toyObj));
        assertEquals("any object", toy.getAnyAutoProp().getObject(ToyClass2.bjsFactory, ToyClass2.class).getLog());
    }

    @Test
    public void testBjsObjAutoProp() {
        assertNull(toy.getBjsObjAutoProp());

        toy.setBjsObjAutoProp(toyObj);
        assertEquals("any object", toy.getBjsObjAutoProp().getLog());
    }

    @Test
    public void testLambdaAutoProp() {
        assertNull(toy.getLambdaAutoProp());

        toy.setLambdaAutoProp(string -> string == null ? "null!" : string + " 1984!");
        assertEquals("null!", toy.getLambdaAutoProp().apply(null));
        assertEquals("W 1984!", toy.getLambdaAutoProp().apply("W"));

        toy.setLambdaAutoProp(null);
        assertNull(toy.getLambdaAutoProp());

        toy.setLambdaAutoProp(string -> null);
        assertNull(toy.getLambdaAutoProp().apply("x"));
    }

    @Test
    public void testLambdaAutoProp_putNullToJs() {
        String nullTest = "(this.lambdaAutoProp() === null)";

        toy.setLambdaAutoProp(string -> "hey");
        toy.evalAndSetValue(nullTest);
        assertFalse(toy.boolFunc());

        toy.setLambdaAutoProp(string -> null);
        toy.evalAndSetValue(nullTest);
        assertTrue(toy.boolFunc());
    }

    @Test
    public void testNativeArrayAutoProp() {
        assertNull(toy.getNativeArrayAutoProp());

        toy.setNativeArrayAutoProp(new String[][][]{{{"a", "b"}}});
        assertArrayEquals(new String[][][]{{{"a", "b"}}}, toy.getNativeArrayAutoProp());

        toy.setNativeArrayAutoProp(new String[][][]{{{}, {}}});
        assertArrayEquals(new String[][][]{{{}, {}}}, toy.getNativeArrayAutoProp());

        toy.setNativeArrayAutoProp(new String[][][]{{}, {}});
        assertArrayEquals(new String[][][]{{}, {}}, toy.getNativeArrayAutoProp());

        toy.setNativeArrayAutoProp(new String[][][]{});
        assertArrayEquals(new String[][][]{}, toy.getNativeArrayAutoProp());

        toy.setNativeArrayAutoProp(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}});
        assertArrayEquals(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}}, toy.getNativeArrayAutoProp());
    }

    @Test
    public void testBjsObjArrayAutoProp() {
        assertNull(toy.getBjsObjArrayAutoProp());

        toy.setBjsObjArrayAutoProp(new ToyClass2[][][]{{{toyObj}}});
        assertArrayEquals(new ToyClass2[][][]{{{toyObj}}}, toy.getBjsObjArrayAutoProp());

        toy.setBjsObjArrayAutoProp(new ToyClass2[][][]{{{}, {}}});
        assertArrayEquals(new ToyClass2[][][]{{{}, {}}}, toy.getBjsObjArrayAutoProp());

        toy.setBjsObjArrayAutoProp(new ToyClass2[][][]{{}, {}});
        assertArrayEquals(new ToyClass2[][][]{{}, {}}, toy.getBjsObjArrayAutoProp());

        toy.setBjsObjArrayAutoProp(new ToyClass2[][][]{});
        assertArrayEquals(new ToyClass2[][][]{}, toy.getBjsObjArrayAutoProp());

        toy.setBjsObjArrayAutoProp(new ToyClass2[][][]{null, {null}, {{null}}, {{toyObj, null}, null}});
        assertArrayEquals(new ToyClass2[][][]{null, {null}, {{null}}, {{toyObj, null}, null}}, toy.getBjsObjArrayAutoProp());
    }

    @Test
    public void testAnyArrayAutoProp() {
        assertNull(toy.getAnyArrayAutoProp());

        BjsAnyObject anyObj = new BjsAnyObject(toyObj);

        toy.setAnyArrayAutoProp(new BjsAnyObject[][][]{{{anyObj}}});
        assertEquals("any object", toy.getAnyArrayAutoProp()[0][0][0].getObject(ToyClass2.bjsFactory, ToyClass2.class).getLog());

        toy.setAnyArrayAutoProp(new BjsAnyObject[][][]{{{}}});
        assertEquals(0, toy.getAnyArrayAutoProp()[0][0].length);
    }

    @Test
    public void testLambdaArrayAutoProp() {
        assertNull(toy.getLambdaArrayAutoProp());

        Lambda.F1<String, String> lambda1a = s -> (s != null ? s : "") + "-1a";
        Lambda.F1<String, String> lambda1b = s -> (s != null ? s : "") + "-1b";
        Lambda.F1<String, String> lambda2a = s -> (s != null ? s : "") + "-2a";

        toy.setLambdaArrayAutoProp(new Lambda.F1[][][]{{{lambda1a, lambda1b}, {lambda2a, null}}});

        assertEquals("test-1a", toy.getLambdaArrayAutoProp()[0][0][0].apply("test"));
        assertEquals("test-1b", toy.getLambdaArrayAutoProp()[0][0][1].apply("test"));
        assertEquals("test-2a", toy.getLambdaArrayAutoProp()[0][1][0].apply("test"));
        assertNull(toy.getLambdaArrayAutoProp()[0][1][1]);

        toy.setLambdaArrayAutoProp(new Lambda.F1[][][]{{{}}});
        assertEquals(0, toy.getLambdaArrayAutoProp()[0][0].length);
    }

    @Test
    public void testProp() {
        assertEquals("1984!", toy.getProp());

        toy.setProp("test value");
        assertEquals("test value", toy.getProp());

        toy.setProp(null);
        assertEquals("1984!", toy.getProp());
    }

    @Test
    public void testVoidFunc() {
        toy.voidFunc();
        assertEquals("called voidFunc", toy.getLog());
    }

    @Test
    public void testParamsFunc() {
        toy.paramsFunc(true, testDate, 01.984, 1984, "1984", new BjsAnyObject(toyObj), toyObj,
                new Integer[]{1,2,3}, () -> "lambda return value");
        assertEquals("called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value", toy.getLog());
    }

    @Test
    public void testParamsFunc_null() {
        toy.paramsFunc(null, null, null, null, null, ToyClass2.bjs.anyNull(), null, null, null);
        assertEquals("called paramsFunc with params: null, null, null, null, null, null, null, null, null", toy.getLog());
    }

    @Test
    public void testBoolFunc() {
        assertNull(toy.boolFunc());
        assertEquals("called retValueFunc", toy.getLog());

        toy.evalAndSetValue("null");
        assertNull(toy.boolFunc());

        toy.evalAndSetValue("false");
        assertFalse(toy.boolFunc());

        toy.evalAndSetValue("true");
        assertTrue(toy.boolFunc());

        toy.evalAndSetValue("!!1");
        assertTrue(toy.boolFunc());
    }

    @Test
    public void testDateFunc() {
        assertNull(toy.dateFunc());
        assertEquals("called retValueFunc", toy.getLog());

        toy.evalAndSetValue("null");
        assertNull(toy.dateFunc());

        toy.evalAndSetValue("new Date(" + testDateTimestamp + ")");
        assertEquals(testDate, toy.dateFunc());
    }

    @Test
    public void testFloatFunc() {
        assertNull(toy.floatFunc());
        assertEquals("called retValueFunc", toy.getLog());

        toy.evalAndSetValue("null");
        assertNull(toy.floatFunc());

        toy.evalAndSetValue(".1984");
        assertEquals(0.1984, toy.floatFunc(), 0.0);

        toy.evalAndSetValue("123456789.123456789");
        assertEquals(123456789.123456789, toy.floatFunc(), 0.0);
    }

    @Test
    public void testIntFunc() {
        assertNull(toy.intFunc());
        assertEquals("called retValueFunc", toy.getLog());

        toy.evalAndSetValue("null");
        assertNull(toy.intFunc());

        toy.evalAndSetValue("1984");
        assertEquals(1984, (long) toy.intFunc());

        toy.evalAndSetValue("1234567890");
        assertEquals(1234567890, (long) toy.intFunc());
    }

    @Test
    public void testStringFunc() {
        assertNull(toy.stringFunc());
        assertEquals("called retValueFunc", toy.getLog());

        toy.evalAndSetValue("null");
        assertNull(toy.stringFunc());

        toy.evalAndSetValue("'hello 84! 👋'");
        assertEquals("hello 84! 👋", toy.stringFunc());
    }

    @Test
    public void testLambdaVoidFunc() {
        Boolean[] check = new Boolean[] {false};

        Lambda.F0<Void> jsLambda = toy.lambdaVoidFunc(() -> {
           assertEquals("calling lambda", toy.getLog());
           check[0] = true;
           return null;
        });

        assertEquals("called lambdaVoidFunc", toy.getLog());
        jsLambda.apply();
        assertTrue(check[0]);

        Lambda.F0<Void> nilLambda = toy.lambdaVoidFunc(null);
        assertNull(nilLambda);
    }

    @Test
    public void testLambdaWithParamsFunc() {
        toy.lambdaWithParamsFunc((integer, nullStr, any, obj) -> {
            assertEquals("called lambdaWithParamsFunc", toy.getLog());
            assertEquals(1984, (int) integer);
            assertNull(nullStr);
            assertEquals("hello 84", any.getObject(ToyClass2.bjsFactory, ToyClass2.class).getLog());
            assertEquals("hello 84", obj.getLog());
            return "1984!";
        });
        assertEquals("called lambda with result: 1984!", toy.getLog());
    }

    @Test
    public void testReturningLambdaWithParamsFunc() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass2, Integer[], String> lambda = toy.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", toy.getLog());
        String lambdaRetValue = lambda.apply(1984, new BjsAnyObject(toyObj), toyObj, new Integer[]{1,2,3});
        assertEquals("called returned lambda with params: 1984, any object, any object, [1,2,3]", toy.getLog());
        assertEquals("lambda returning value", lambdaRetValue);
    }

    @Test
    public void testReturningLambdaWithParamsFunc_null() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass2, Integer[], String> lambda = toy.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", toy.getLog());
        String lambdaRetValue = lambda.apply(null, ToyClass2.bjs.anyNull(), null, null);
        assertEquals("called returned lambda with params: null, null, null, null", toy.getLog());
        assertEquals("lambda returning value", lambdaRetValue);
    }
}
