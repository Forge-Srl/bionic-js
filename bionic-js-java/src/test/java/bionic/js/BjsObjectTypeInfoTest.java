package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BjsObjectTypeInfoTest extends TestWithBjsMock {
    @Test
    public void get_exception() {
        class DummyWrong extends BjsObject {
            private DummyWrong(JSReference jsObject) {
                super(jsObject);
            }
        }

        assertThrows(RuntimeException.class, () -> {
            BjsObjectTypeInfo<DummyWrong> info = BjsObjectTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get() {
        JSReference mock = mock(JSReference.class);
        final String path = "/some/path";

        @BjsObjectTypeInfo.BjsModulePath(path = path)
        class Dummy extends BjsObject {
            private Dummy(JSReference jsObject) {
                super(jsObject);
            }
        }

        BjsObjectTypeInfo<Dummy> info = BjsObjectTypeInfo.get(Dummy.class);
        when(Bjs.get().loadModule(path)).thenReturn(mock);

        JSReference result = info.bjsClass();
        assertEquals(mock, result);

        //assertion for cache
        BjsObjectTypeInfo<Dummy> info2 = BjsObjectTypeInfo.get(Dummy.class);
        assertEquals(info, info2);
    }
}
