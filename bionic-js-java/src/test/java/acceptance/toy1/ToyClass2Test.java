package acceptance.toy1;

import acceptance.toy1.bjs.BjsTestProject;
import acceptance.toy1.bjs.ToyClass2;
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
        BjsTestProject.setJsEngine(new V8Engine());
    }

    @BeforeEach
    public void before()
    {
        testDateTimestamp = 472867200000D;
        testDate = Date.from(Instant.ofEpochMilli(testDateTimestamp.longValue()));
        toyObj = new ToyClass2(false);
        toyObj.log("any object");
        
        toy = new ToyClass2(false);
        assertEquals("called constructor without params", toy.log());
    }

    @Test
    public void testConstructorParam() {
        toy = new ToyClass2(true);
        assertEquals("called constructor with params: true", toy.log());
    }

    @Test
    public void testConstructorNullParam() {
        toy = new ToyClass2((Boolean) null);
        assertEquals("called constructor without params", toy.log());
    }

    @Test
    public void testNativeAutoProp()
    {
        assertNull(toy.nativeAutoProp());

        toy.nativeAutoProp("1984!");
        assertEquals("1984!", toy.nativeAutoProp());

        toy.nativeAutoProp(null);
        assertNull(toy.nativeAutoProp());
    }

    @Test
    public void testAnyAutoProp() {
        assertEquals(toy.anyAutoProp().jsObj.getActualType(), JSType.Undefined);

        toy.anyAutoProp(new BjsAnyObject(toyObj));
        assertEquals("any object", toy.anyAutoProp().getObject(ToyClass2.bjsFactory, ToyClass2.class).log());
    }

    @Test
    public void testBjsObjAutoProp() {
        assertNull(toy.bjsObjAutoProp());

        toy.bjsObjAutoProp(toyObj);
        assertEquals("any object", toy.bjsObjAutoProp().log());
    }

    @Test
    public void testLambdaAutoProp() {
        assertNull(toy.lambdaAutoProp());

        toy.lambdaAutoProp(string -> string == null ? "null!" : string + " 1984!");
        assertEquals("null!", toy.lambdaAutoProp().apply(null));
        assertEquals("W 1984!", toy.lambdaAutoProp().apply("W"));

        toy.lambdaAutoProp(null);
        assertNull(toy.lambdaAutoProp());

        toy.lambdaAutoProp(string -> null);
        assertNull(toy.lambdaAutoProp().apply("x"));
    }

    @Test
    public void testLambdaAutoProp_putNullToJs() {
        String nullTest = "(this.lambdaAutoProp() === null)";

        toy.lambdaAutoProp(string -> "hey");
        toy.evalAndSetValue(nullTest);
        assertFalse(toy.boolFunc());

        toy.lambdaAutoProp(string -> null);
        toy.evalAndSetValue(nullTest);
        assertTrue(toy.boolFunc());
    }

    @Test
    public void testNativeArrayAutoProp() {
        assertNull(toy.nativeArrayAutoProp());

        toy.nativeArrayAutoProp(new String[][][]{{{"a", "b"}}});
        assertArrayEquals(new String[][][]{{{"a", "b"}}}, toy.nativeArrayAutoProp());

        toy.nativeArrayAutoProp(new String[][][]{{{}, {}}});
        assertArrayEquals(new String[][][]{{{}, {}}}, toy.nativeArrayAutoProp());

        toy.nativeArrayAutoProp(new String[][][]{{}, {}});
        assertArrayEquals(new String[][][]{{}, {}}, toy.nativeArrayAutoProp());

        toy.nativeArrayAutoProp(new String[][][]{});
        assertArrayEquals(new String[][][]{}, toy.nativeArrayAutoProp());

        toy.nativeArrayAutoProp(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}});
        assertArrayEquals(new String[][][]{null, {null}, {{null}}, {{"test", null}, null}}, toy.nativeArrayAutoProp());
    }

    @Test
    public void testBjsObjArrayAutoProp() {
        assertNull(toy.bjsObjArrayAutoProp());

        toy.bjsObjArrayAutoProp(new ToyClass2[][][]{{{toyObj}}});
        assertArrayEquals(new ToyClass2[][][]{{{toyObj}}}, toy.bjsObjArrayAutoProp());

        toy.bjsObjArrayAutoProp(new ToyClass2[][][]{{{}, {}}});
        assertArrayEquals(new ToyClass2[][][]{{{}, {}}}, toy.bjsObjArrayAutoProp());

        toy.bjsObjArrayAutoProp(new ToyClass2[][][]{{}, {}});
        assertArrayEquals(new ToyClass2[][][]{{}, {}}, toy.bjsObjArrayAutoProp());

        toy.bjsObjArrayAutoProp(new ToyClass2[][][]{});
        assertArrayEquals(new ToyClass2[][][]{}, toy.bjsObjArrayAutoProp());

        toy.bjsObjArrayAutoProp(new ToyClass2[][][]{null, {null}, {{null}}, {{toyObj, null}, null}});
        assertArrayEquals(new ToyClass2[][][]{null, {null}, {{null}}, {{toyObj, null}, null}}, toy.bjsObjArrayAutoProp());
    }

    @Test
    public void testAnyArrayAutoProp() {
        assertNull(toy.anyArrayAutoProp());

        BjsAnyObject anyObj = new BjsAnyObject(toyObj);

        toy.anyArrayAutoProp(new BjsAnyObject[][][]{{{anyObj}}});
        assertEquals("any object", toy.anyArrayAutoProp()[0][0][0].getObject(ToyClass2.bjsFactory, ToyClass2.class).log());

        toy.anyArrayAutoProp(new BjsAnyObject[][][]{{{}}});
        assertEquals(0, toy.anyArrayAutoProp()[0][0].length);
    }

    @Test
    public void testLambdaArrayAutoProp() {
        assertNull(toy.lambdaArrayAutoProp());

        Lambda.F1<String, String> lambda1a = s -> (s != null ? s : "") + "-1a";
        Lambda.F1<String, String> lambda1b = s -> (s != null ? s : "") + "-1b";
        Lambda.F1<String, String> lambda2a = s -> (s != null ? s : "") + "-2a";

        toy.lambdaArrayAutoProp(new Lambda.F1[][][]{{{lambda1a, lambda1b}, {lambda2a, null}}});

        assertEquals("test-1a", toy.lambdaArrayAutoProp()[0][0][0].apply("test"));
        assertEquals("test-1b", toy.lambdaArrayAutoProp()[0][0][1].apply("test"));
        assertEquals("test-2a", toy.lambdaArrayAutoProp()[0][1][0].apply("test"));
        assertNull(toy.lambdaArrayAutoProp()[0][1][1]);

        toy.lambdaArrayAutoProp(new Lambda.F1[][][]{{{}}});
        assertEquals(0, toy.lambdaArrayAutoProp()[0][0].length);
    }

    @Test
    public void testProp() {
        assertEquals("1984!", toy.prop());

        toy.prop("test value");
        assertEquals("test value", toy.prop());

        toy.prop(null);
        assertEquals("1984!", toy.prop());
    }

    @Test
    public void testVoidFunc() {
        toy.voidFunc();
        assertEquals("called voidFunc", toy.log());
    }

    @Test
    public void testParamsFunc() {
        toy.paramsFunc(true, testDate, 01.984, 1984, "1984", new BjsAnyObject(toyObj), toyObj,
                new Integer[]{1,2,3}, () -> "lambda return value");
        assertEquals("called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value", toy.log());
    }

    @Test
    public void testParamsFunc_null() {
        toy.paramsFunc(null, null, null, null, null, ToyClass2.bjs.anyNull(), null, null, null);
        assertEquals("called paramsFunc with params: null, null, null, null, null, null, null, null, null", toy.log());
    }

    @Test
    public void testBoolFunc() {
        assertNull(toy.boolFunc());
        assertEquals("called retValueFunc", toy.log());

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
        assertEquals("called retValueFunc", toy.log());

        toy.evalAndSetValue("null");
        assertNull(toy.dateFunc());

        toy.evalAndSetValue("new Date(" + testDateTimestamp + ")");
        assertEquals(testDate, toy.dateFunc());
    }

    @Test
    public void testFloatFunc() {
        assertNull(toy.floatFunc());
        assertEquals("called retValueFunc", toy.log());

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
        assertEquals("called retValueFunc", toy.log());

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
        assertEquals("called retValueFunc", toy.log());

        toy.evalAndSetValue("null");
        assertNull(toy.stringFunc());

        toy.evalAndSetValue("'hello 84! 👋'");
        assertEquals("hello 84! 👋", toy.stringFunc());
    }

    @Test
    public void testLambdaVoidFunc() {
        Boolean[] check = new Boolean[] {false};

        Lambda.F0<Void> jsLambda = toy.lambdaVoidFunc(() -> {
           assertEquals("calling lambda", toy.log());
           check[0] = true;
           return null;
        });

        assertEquals("called lambdaVoidFunc", toy.log());
        jsLambda.apply();
        assertTrue(check[0]);

        Lambda.F0<Void> nilLambda = toy.lambdaVoidFunc(null);
        assertNull(nilLambda);
    }

    @Test
    public void testLambdaWithParamsFunc() {
        toy.lambdaWithParamsFunc((integer, nullStr, any, obj) -> {
            assertEquals("called lambdaWithParamsFunc", toy.log());
            assertEquals(1984, (int) integer);
            assertNull(nullStr);
            assertEquals("hello 84", any.getObject(ToyClass2.bjsFactory, ToyClass2.class).log());
            assertEquals("hello 84", obj.log());
            return "1984!";
        });
        assertEquals("called lambda with result: 1984!", toy.log());
    }

    @Test
    public void testReturningLambdaWithParamsFunc() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass2, Integer[], String> lambda = toy.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", toy.log());
        String lambdaRetValue = lambda.apply(1984, new BjsAnyObject(toyObj), toyObj, new Integer[]{1,2,3});
        assertEquals("called returned lambda with params: 1984, any object, any object, [1,2,3]", toy.log());
        assertEquals("lambda returning value", lambdaRetValue);
    }

    @Test
    public void testReturningLambdaWithParamsFunc_null() {
        Lambda.F4<Integer, BjsAnyObject, ToyClass2, Integer[], String> lambda = toy.returningLambdaWithParamsFunc();
        assertEquals("called returningLambdaWithParamsFunc", toy.log());
        String lambdaRetValue = lambda.apply(null, ToyClass2.bjs.anyNull(), null, null);
        assertEquals("called returned lambda with params: null, null, null, null", toy.log());
        assertEquals("lambda returning value", lambdaRetValue);
    }
}
