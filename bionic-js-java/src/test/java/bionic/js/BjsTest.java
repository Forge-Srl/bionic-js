package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;
import jjbridge.engine.v8.V8Engine;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class BjsTest {
    private static JSRuntime runtime;

    @BeforeAll
    public static void beforeClass() {
        runtime = new V8Engine().newRuntime();
        Bjs.setDefaultRuntime(runtime);
        Bjs.setBundle(BjsTest.class, "testBundle");
    }

    @Test
    public void get() {
        // Assertion for singleton
        assertSame(Bjs.get(), Bjs.get());
    }

    @Test
    public void jsNull() {
        JSReference jsNull = Bjs.get().jsNull;
        assertEquals(jsNull.getActualType(), JSType.Null);
        assertEquals(jsNull, Bjs.get().jsNull);
    }

    @Test
    public void jsUndefined() {
        JSReference jsUndefined = Bjs.get().jsUndefined;
        assertEquals(jsUndefined.getActualType(), JSType.Undefined);
        assertEquals(jsUndefined, Bjs.get().jsUndefined);
    }

    @Test
    public void call() {
        JSReference obj = runtime.executeScript("({asd: x => x + 2})");
        JSReference result = Bjs.get().call(obj, "asd", Bjs.get().putPrimitive(40));
        assertEquals(42, (int) Bjs.get().getInteger(result));
        result = Bjs.get().call(obj, "asd", Bjs.get().putPrimitive("also text "));
        assertEquals("also text 2", Bjs.get().getString(result));
    }

    @Test
    public void funcCall() {
        JSReference func = runtime.executeScript("x => x + 2");
        JSReference result = Bjs.get().funcCall(func, Bjs.get().putPrimitive(40));
        assertEquals(42, Bjs.get().getInteger(result));
        result = Bjs.get().funcCall(func, Bjs.get().putPrimitive("also text "));
        assertEquals("also text 2", Bjs.get().getString(result));
    }

    @Test
    public void get_set_Property() {
        JSReference obj = runtime.executeScript("({asd: 5})");
        assertEquals(5, (int) Bjs.get().getInteger(Bjs.get().getProperty(obj, "asd")));
        Bjs.get().setProperty(obj, "asd", Bjs.get().putPrimitive("something else"));
        assertEquals("something else", Bjs.get().getString(Bjs.get().getProperty(obj, "asd")));
        assertEquals(Bjs.get().jsUndefined, Bjs.get().getProperty(obj, "other"));
        Bjs.get().setProperty(obj, "other", Bjs.get().putPrimitive(true));
        assertEquals(true, Bjs.get().getBoolean(Bjs.get().getProperty(obj, "other")));
    }

    @Test
    public void put_get_Primitive_Null() {
        assertEquals(Bjs.get().jsNull, Bjs.get().putPrimitive((Boolean) null));
        assertEquals(Bjs.get().jsNull, Bjs.get().putPrimitive((Integer) null));
        assertEquals(Bjs.get().jsNull, Bjs.get().putPrimitive((Double) null));
        assertEquals(Bjs.get().jsNull, Bjs.get().putPrimitive((String) null));
        assertEquals(Bjs.get().jsNull, Bjs.get().putPrimitive((Date) null));

        assertNull(Bjs.get().getBoolean(Bjs.get().putPrimitive((Boolean) null)));
        assertNull(Bjs.get().getInteger(Bjs.get().putPrimitive((Integer) null)));
        assertNull(Bjs.get().getDouble(Bjs.get().putPrimitive((Double) null)));
        assertNull(Bjs.get().getString(Bjs.get().putPrimitive((String) null)));
        assertNull(Bjs.get().getDate(Bjs.get().putPrimitive((Date) null)));
    }

    @Test
    public void put_get_Primitive() {
        assertEquals(true, Bjs.get().getBoolean(Bjs.get().putPrimitive(true)));
        assertEquals(false, Bjs.get().getBoolean(Bjs.get().putPrimitive(false)));
        assertEquals(-126, (int) Bjs.get().getInteger(Bjs.get().putPrimitive(-126)));
        assertEquals(1.6542E12, Bjs.get().getDouble(Bjs.get().putPrimitive(1.6542E12)), 0);
        assertEquals("some string", Bjs.get().getString(Bjs.get().putPrimitive("some string")));
        Date date = new Date();
        assertEquals(date, Bjs.get().getDate(Bjs.get().putPrimitive(date)));
    }

    @Test
    public void put_get_Native() {
        assertEquals(Bjs.get().jsNull, Bjs.get().putNative(null));
        assertNull(Bjs.get().getNative(Bjs.get().putNative(null)));

        HashMap<String, InputStream[]> nativeObject = new HashMap<>();
        nativeObject.put("something", new InputStream[]{System.in});
        assertEquals(nativeObject, Bjs.get().getNative(Bjs.get().putNative(nativeObject)));
    }

    @Test
    public void put_get_Obj() {
        BjsObject obj = new BjsObject(runtime.executeScript("({x: 1984, y: '1Q84'})"));
        assertEquals(obj, Bjs.get().getObj(Bjs.get().putObj(obj), BjsObject::new, BjsObject.class));
        assertNull(Bjs.get().getObj(Bjs.get().putObj(null), BjsObject::new, BjsObject.class));
    }

    @Test
    public void put_get_Func() {
        Lambda.F2<Integer, Integer, String> func = (i1, i2) -> String.format("%d + %d = %d", i1, i2, i1+i2);
        FunctionCallback functionCallback = jsReferences -> null;
        assertEquals(func, Bjs.get().getFunc(Bjs.get().putFunc(func, functionCallback), func));
        assertNull(Bjs.get().getFunc(Bjs.get().putFunc(null, functionCallback), func));
    }

    @Test
    public void put_get_Array() {
        Integer[] array = {1, 2, 3};
        Bjs.NativeConverter<Integer> nativeConverter = i -> Bjs.get().putPrimitive(i);
        Bjs.JSReferenceConverter<Integer> referenceConverter = ref -> Bjs.get().getInteger(ref);
        assertArrayEquals(array, Bjs.get().getArray(Bjs.get().putArray(array, nativeConverter), referenceConverter, Integer.class));
        assertNull(Bjs.get().getArray(Bjs.get().putArray(null, nativeConverter), referenceConverter, Integer.class));
    }

    @Test
    public void ensureArraySize() {
        JSReference u = Bjs.get().jsUndefined;
        JSReference x = runtime.executeScript("5");

        assertArrayEquals(new JSReference[] {}, Bjs.get().ensureArraySize(new JSReference[] {}, 0));
        assertArrayEquals(new JSReference[] {x}, Bjs.get().ensureArraySize(new JSReference[] {x}, 0));
        assertArrayEquals(new JSReference[] {x,x}, Bjs.get().ensureArraySize(new JSReference[] {x,x}, 0));
        assertArrayEquals(new JSReference[] {u,u,u}, Bjs.get().ensureArraySize(new JSReference[] {}, 3));
        assertArrayEquals(new JSReference[] {x,u,u}, Bjs.get().ensureArraySize(new JSReference[] {x}, 3));
        assertArrayEquals(new JSReference[] {x,x,u}, Bjs.get().ensureArraySize(new JSReference[] {x,x}, 3));
        assertArrayEquals(new JSReference[] {x,x,x}, Bjs.get().ensureArraySize(new JSReference[] {x,x,x}, 3));
        assertArrayEquals(new JSReference[] {x,x,x,x}, Bjs.get().ensureArraySize(new JSReference[] {x,x,x,x}, 3));
    }

    @Test
    public void constructObject() {
        JSReference jsClass = runtime.executeScript("(class {constructor(asd,qwe){Object.assign(this,{asd,qwe})}})");
        JSReference obj = Bjs.get().constructObject(jsClass, new JSReference[]{Bjs.get().putPrimitive("something"), Bjs.get().jsNull});
        assertEquals("something", Bjs.get().getString(Bjs.get().getProperty(obj, "asd")));
        assertEquals(Bjs.get().jsNull, Bjs.get().getProperty(obj, "qwe"));
    }
}
