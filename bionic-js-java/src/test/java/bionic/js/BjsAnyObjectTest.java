package bionic.js;

import bionic.js.testutils.DummyBjsObjectForTest;
import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

public class BjsAnyObjectTest extends TestWithBjsMock {
    @Test
    public void getObject_fromJSReference() {
        JSReference jsObject = mock(JSReference.class);
        Bjs.JSReferenceConverter<DummyBjsObjectForTest> converter = jsReference -> null;

        BjsAnyObject obj = new BjsAnyObject(jsObject);

        lenient().when(bjs.getObj(jsObject, converter, DummyBjsObjectForTest.class)).thenReturn(null);
        assertNull(obj.getObject(converter, DummyBjsObjectForTest.class));
    }

    @Test
    public void getObject_fromBjsObject() {
        DummyBjsObjectForTest bjsObject = mock(DummyBjsObjectForTest.class);
        Bjs.JSReferenceConverter<DummyBjsObjectForTest> converter = jsReference -> null;

        BjsAnyObject obj = new BjsAnyObject(bjsObject);

        when(bjs.getObj(null, converter, DummyBjsObjectForTest.class)).thenReturn(null);
        assertNull(obj.getObject(converter, DummyBjsObjectForTest.class));
    }
}
