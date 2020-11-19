package bionic.js;

import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BjsNativeWrapperTypeInfoTest {
    private static final String path = "path";
    private static final String name = "name";

    @Test
    public void get_exception_WrapperPath() {
        class DummyWrong extends BjsNativeWrapper<BjsExport> {}

        assertThrows(RuntimeException.class, () -> {
            BjsNativeWrapperTypeInfo<DummyWrong> info = BjsNativeWrapperTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get_exception_Name() {
        @BjsNativeWrapperTypeInfo.WrapperPath(path = path)
        class DummyWrong extends BjsNativeWrapper<BjsExport> {}

        assertThrows(RuntimeException.class, () -> {
            BjsNativeWrapperTypeInfo<DummyWrong> info = BjsNativeWrapperTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get_exception_Exporter() {
        @BjsNativeWrapperTypeInfo.WrapperPath(path = path)
        @BjsNativeWrapperTypeInfo.Name(name = name)
        class DummyWrong extends BjsNativeWrapper<BjsExport> {}

        assertThrows(RuntimeException.class, () -> {
            BjsNativeWrapperTypeInfo<DummyWrong> info = BjsNativeWrapperTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get() {
        BjsContext context = mock(BjsContext.class);
        BjsNativeExports nativeExports = mock(BjsNativeExports.class);
        JSReference expectedResult = mock(JSReference.class);

        Dummy.valueToCheck = nativeExports;
        BjsNativeWrapperTypeInfo<Dummy> info = BjsNativeWrapperTypeInfo.get(Dummy.class);
        when(context.createNativeExports()).thenReturn(nativeExports);
        when(nativeExports.getExportsObject()).thenReturn(expectedResult);

        JSReference actualResult = info.bjsGetNativeFunctions(context);
        assertEquals(expectedResult, actualResult);
        assertEquals(path, info.wrapperPath);
        assertEquals(name, info.name);

        //assertion for cache
        BjsNativeWrapperTypeInfo<Dummy> info2 = BjsNativeWrapperTypeInfo.get(Dummy.class);
        assertEquals(info, info2);
    }

    @BjsNativeWrapperTypeInfo.WrapperPath(path = path)
    @BjsNativeWrapperTypeInfo.Name(name = name)
    static class Dummy extends BjsNativeWrapper<BjsExport> {
        private static BjsNativeExports valueToCheck;

        @BjsNativeWrapperTypeInfo.Exporter
        static void bjsExportFunctions(BjsNativeExports nativeExport) {
            assertEquals(nativeExport, valueToCheck);
        }
    }
}
