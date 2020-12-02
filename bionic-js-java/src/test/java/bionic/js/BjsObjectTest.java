package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.*;

public class BjsObjectTest extends TestWithBjsMock {

    @BjsObjectTypeInfo.BjsLocation(project = BJS_TEST_PROJECT, module = "Dummy")
    static class Dummy extends BjsObject
    {
        public static Bjs bjs = BjsObjectTypeInfo.get(Dummy.class).bjsLocator.get();

        public Dummy(JSReference jsObject)
        {
            super(Dummy.class, jsObject);
        }

        public Dummy(JSReference[] args)
        {
            super(Dummy.class, args);
        }
    }

    @BeforeEach
    @Override
    public void beforeEach() {
        super.beforeEach();

        exposeMockedBjsTo("bionic.js");
    }

    @Test
    public void ctor_jsObject() {
        JSReference obj = mock(JSReference.class);

        Dummy bjsObject = new Dummy(obj);
        verify(Dummy.bjs).createNativeObject(obj, bjsObject);
    }

    @Test
    public void ctor_jsClass_with_arguments() {
        JSReference jsClass = mock(JSReference.class);
        JSReference[] arguments = new JSReference[0];

        when(Dummy.bjs.loadModule("Dummy")).thenReturn(jsClass);
        when(Dummy.bjs.constructObject(jsClass, arguments)).thenReturn(null);
        Dummy bjsObject = new Dummy(arguments);
        verify(Dummy.bjs).createNativeObject(null, bjsObject);
    }

    @Test
    public void bjsCall() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        JSReference jsReference2 = mock(JSReference.class);
        JSReference jsReference3 = mock(JSReference.class);
        Dummy object = new Dummy(jsReference0);

        when(Dummy.bjs.call(jsReference0, name, jsReference1, jsReference2, jsReference3)).thenReturn(jsReference2);
        JSReference result = object.bjsCall(name, jsReference1, jsReference2, jsReference3);
        assertEquals(jsReference2, result);
    }

    @Test
    public void bjsGetProperty() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        Dummy object = new Dummy(jsReference0);

        when(Dummy.bjs.getProperty(jsReference0, name)).thenReturn(jsReference1);
        JSReference result = object.bjsGetProperty(name);
        assertEquals(jsReference1, result);
    }

    @Test
    public void bjsSetProperty() {
        String name = "name";
        JSReference jsReference0 = mock(JSReference.class);
        JSReference jsReference1 = mock(JSReference.class);
        Dummy object = new Dummy(jsReference0);

        object.bjsSetProperty(name, jsReference1);
        verify(Dummy.bjs).setProperty(jsReference0, name, jsReference1);
    }

    @Test
    public void castTo() {
        @BjsObjectTypeInfo.BjsLocation(project = BJS_TEST_PROJECT, module = "Dummy2")
        class Dummy2 extends BjsObject {
            private Dummy2(JSReference jsObject) {
                super(Dummy2.class, jsObject);
            }
        }

        Bjs.JSReferenceConverter<Dummy2> converter = jsReference -> null;
        JSReference jsReference0 = mock(JSReference.class);
        Dummy2 dummy2 = new Dummy2(jsReference0);
        Dummy object = new Dummy(jsReference0);

        when(Dummy.bjs.getObj(jsReference0, converter, Dummy2.class)).thenReturn(dummy2);
        Dummy2 result = object.castTo(converter, Dummy2.class);
        assertEquals(dummy2, result);
    }

    @Test
    public void HashCode() {
        JSReference obj = mock(JSReference.class);
        BjsObject bjsObject = new Dummy(obj);

        assertEquals(Objects.hash(obj), bjsObject.hashCode());
    }

    @Test
    public void Equals() {
        JSReference obj = mock(JSReference.class);
        BjsObject bjsObject = new Dummy(obj);

        assertEquals(bjsObject, bjsObject);
        assertEquals(bjsObject, new Dummy(obj));
        assertNotEquals(bjsObject, new Dummy(mock(JSReference.class)));
    }
}
