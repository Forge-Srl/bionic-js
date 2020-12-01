package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSFunction;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BjsNativeExportsTest {
    @Mock private JSRuntime runtime;
    @Mock private JSReference exportsObject;
    private BjsNativeExports nativeExports;

    @BeforeEach
    public void before() {
        when(runtime.newReference(JSType.Object)).thenReturn(exportsObject);
        nativeExports = spy(new BjsNativeExports(runtime));
    }

    @Test
    public void getExportsObject() {
        assertEquals(exportsObject, nativeExports.getExportsObject());
    }

    @Test
    public void exportBindFunction() {
        FunctionCallback<?> functionCallback = jsReferences -> null;

        doReturn(nativeExports).when(nativeExports).exportFunction("bjsBind", functionCallback);
        assertEquals(nativeExports, nativeExports.exportBindFunction(functionCallback));
    }

    @Test
    public void exportFunction() {
        String name = "name";
        FunctionCallback<?> functionCallback = jsReferences -> null;
        JSObject<?> jsObject = mock(JSObject.class);
        JSReference reference = mock(JSReference.class);
        JSFunction<?> jsFunction = mock(JSFunction.class);

        when(runtime.resolveReference(exportsObject)).thenReturn(jsObject);
        when(runtime.newReference(JSType.Function)).thenReturn(reference);
        when(runtime.resolveReference(reference)).thenReturn(jsFunction);

        assertEquals(nativeExports, nativeExports.exportFunction(name, functionCallback));

        verify(jsFunction).setFunction(functionCallback);
        verify(jsObject).set(name, reference);
    }
}
