package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.*;

public class BjsObjectTest extends TestWithBjsMock {
    @Test
    public void ctor_jsObject() {
        JSReference obj = mock(JSReference.class);

        BjsObject bjsObject = new BjsObject(obj);
        verify(Bjs.get()).createNativeObject(obj, bjsObject);
    }

    @Test
    public void ctor_jsClass_with_arguments() {
        final String path = "path";
        JSReference jsClass = mock(JSReference.class);
        JSReference[] arguments = new JSReference[0];

        @BjsObjectTypeInfo.BjsModulePath(path = path)
        class Dummy extends BjsObject {
            public Dummy(JSReference jsObject)
            {
                super(jsObject);
            }
        }

        when(Bjs.get().loadModule(path)).thenReturn(jsClass);
        when(Bjs.get().constructObject(jsClass, arguments)).thenReturn(null);
        BjsObject bjsObject = new BjsObject(Dummy.class, arguments);
        verify(Bjs.get()).createNativeObject(null, bjsObject);
    }

    @Test
    public void bjsCall() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        JSReference jsReference2 = mock(JSReference.class);
        JSReference jsReference3 = mock(JSReference.class);
        BjsObject object = new BjsObject(jsReference0);

        when(Bjs.get().call(jsReference0, name, jsReference1, jsReference2, jsReference3)).thenReturn(jsReference2);
        JSReference result = object.bjsCall(name, jsReference1, jsReference2, jsReference3);
        assertEquals(jsReference2, result);
    }

    @Test
    public void bjsGetProperty() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        BjsObject object = new BjsObject(jsReference0);

        when(Bjs.get().getProperty(jsReference0, name)).thenReturn(jsReference1);
        JSReference result = object.bjsGetProperty(name);
        assertEquals(jsReference1, result);
    }

    @Test
    public void bjsSetProperty() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        BjsObject object = new BjsObject(jsReference0);

        object.bjsSetProperty(name, jsReference1);
        verify(Bjs.get()).setProperty(jsReference0, name, jsReference1);
    }

    @Test
    public void castTo() {
        class Dummy extends BjsObject {
            private Dummy(JSReference jsObject) {
                super(jsObject);
            }
        }

        Bjs.JSReferenceConverter<Dummy> converter = jsReference -> null;
        JSReference jsReference0 = mock(JSReference.class);
        Dummy dummy = new Dummy(jsReference0);
        BjsObject object = new BjsObject(jsReference0);

        when(Bjs.get().getObj(jsReference0, converter, Dummy.class)).thenReturn(dummy);
        Dummy result = object.castTo(converter, Dummy.class);
        assertEquals(dummy, result);
    }

    @Test
    public void HashCode() {
        JSReference obj = mock(JSReference.class);
        BjsObject bjsObject = new BjsObject(obj);

        assertEquals(Objects.hash(obj), bjsObject.hashCode());
    }

    @Test
    public void Equals() {
        JSReference obj = mock(JSReference.class);
        BjsObject bjsObject = new BjsObject(obj);

        assertEquals(bjsObject, bjsObject);
        assertEquals(bjsObject, new BjsObject(obj));
        assertNotEquals(bjsObject, new BjsObject(mock(JSReference.class)));
    }
}
