package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BjsAnyObjectTest extends TestWithBjsMock {
    @Test
    public void getObject_fromJSReference() {
        JSReference jsObject = mock(JSReference.class);
        Bjs.JSReferenceConverter<BjsObject> converter = jsReference -> null;

        BjsAnyObject obj = new BjsAnyObject(jsObject);

        when(Bjs.get().getObj(jsObject, converter, null)).thenReturn(null);
        assertNull(obj.getObject(converter, null));
    }

    @Test
    public void getObject_fromBjsObject() {
        BjsObject bjsObject = mock(BjsObject.class);
        Bjs.JSReferenceConverter<BjsObject> converter = jsReference -> null;

        BjsAnyObject obj = new BjsAnyObject(bjsObject);

        when(Bjs.get().getObj(null, converter, BjsObject.class)).thenReturn(null);
        assertNull(obj.getObject(converter, BjsObject.class));
    }
}
