package bionic.js;

import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BjsNativeWrapperTypeInfoTest {
    private static final String project = "project";
    private static final String module = "module";

    @Test
    public void get_exception_WrapperLocation() {
        class DummyWrong extends BjsNativeWrapper<BjsExport> {
            protected DummyWrong(Class<BjsExport> realImplementation) { super(realImplementation); }
        }

        assertThrows(RuntimeException.class, () -> {
            BjsNativeWrapperTypeInfo<DummyWrong> info = BjsNativeWrapperTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get_exception_Exporter() {
        @BjsTypeInfo.BjsLocation(project = project, module = module)
        class DummyWrong extends BjsNativeWrapper<BjsExport> {
            protected DummyWrong(Class<BjsExport> realImplementation) { super(realImplementation); }
        }

        assertThrows(RuntimeException.class, () -> {
            BjsNativeWrapperTypeInfo<DummyWrong> info = BjsNativeWrapperTypeInfo.get(DummyWrong.class);
        });
    }

    @Test
    public void get_exception_Binder() {
        @BjsTypeInfo.BjsLocation(project = project, module = module)
        class DummyWrong extends BjsNativeWrapper<BjsExport> {
            protected DummyWrong(Class<BjsExport> realImplementation) { super(realImplementation); }
            @BjsNativeWrapperTypeInfo.Exporter
            BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExport) { return nativeExport; }
        }

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
        assertEquals(project, info.bjsLocator.projectName);
        assertEquals(module, info.bjsLocator.moduleName);

        when(context.createNativeExports()).thenReturn(nativeExports);
        when(nativeExports.getExportsObject()).thenReturn(expectedResult);
        JSReference actualResult = info.bjsGetNativeFunctions(context);
        assertEquals(expectedResult, actualResult);

        //assertion for cache
        BjsNativeWrapperTypeInfo<Dummy> info2 = BjsNativeWrapperTypeInfo.get(Dummy.class);
        assertEquals(info, info2);
    }

    @BjsTypeInfo.BjsLocation(project = project, module = module)
    static class Dummy extends BjsNativeWrapper<BjsExport> {
        private static BjsNativeExports valueToCheck;
        protected Dummy(Class<BjsExport> realImplementation) { super(realImplementation); }
        @BjsNativeWrapperTypeInfo.Exporter
        static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExport) {
            assertEquals(nativeExport, valueToCheck);
            return nativeExport;
        }
        @BjsNativeWrapperTypeInfo.Binder
        static void bjsBind_(BjsNativeExports nativeExport) {
            assertEquals(nativeExport, valueToCheck);
        }
    }
}
