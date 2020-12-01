package bionic.js;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class BjsProjectTypeInfoTest
{
    @Test
    public void get_exception() {
        class DummyProject extends BjsProject {}

        assertThrows(RuntimeException.class, () -> {
            BjsProjectTypeInfo<DummyProject> info = BjsProjectTypeInfo.get(DummyProject.class);
        });
    }

    @Test
    public void get() {
        Bjs bjs = mock(Bjs.class);

        BjsProjectTypeInfo<DummyProject> info = BjsProjectTypeInfo.get(DummyProject.class);
        assertNull(DummyProject.capturedBjs);
        info.initialize(bjs);
        assertEquals(bjs, DummyProject.capturedBjs);

        //assertion for cache
        BjsProjectTypeInfo<DummyProject> info2 = BjsProjectTypeInfo.get(DummyProject.class);
        assertEquals(info, info2);
    }

    static class DummyProject extends BjsProject {
        static Bjs capturedBjs = null;

        @BjsProjectTypeInfo.Initializer
        static void initialize(Bjs bjs) {
            capturedBjs = bjs;
        }
    }
}
