package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class BjsObjectTypeInfoTest extends TestWithBjsMock {
    @Test
    public void get_exception() {
        class DummyWrong extends BjsObject {
            private DummyWrong(JSReference jsObject) {
                super(DummyWrong.class, jsObject);
            }
        }

        assertThrows(RuntimeException.class, () -> {
            BjsObjectTypeInfo<DummyWrong> info = BjsObjectTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get() {
        final String project = "project";
        final String module = "module";

        @BjsObjectTypeInfo.BjsLocation(project = project, module = module)
        class Dummy extends BjsObject {
            private Dummy(JSReference jsObject) {
                super(Dummy.class, jsObject);
            }
        }

        BjsObjectTypeInfo<Dummy> info = BjsObjectTypeInfo.get(Dummy.class);
        assertEquals(project, info.bjsLocator.projectName);
        assertEquals(module, info.bjsLocator.moduleName);

        //assertion for cache
        BjsObjectTypeInfo<Dummy> info2 = BjsObjectTypeInfo.get(Dummy.class);
        assertEquals(info, info2);
    }
}
