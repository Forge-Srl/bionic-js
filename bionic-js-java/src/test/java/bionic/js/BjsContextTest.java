package bionic.js;

import bionic.js.testutils.JSRuntimeForTest;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.*;
import jjbridge.api.value.strategy.FunctionCallback;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BjsContextTest {
    private JSRuntimeForTest runtime;
    private BjsContext context;

    @BjsTypeInfo.BjsLocation(project = "", module = "")
    private static class InvalidDummyWrapper extends BjsNativeWrapper<BjsExport> {
        protected InvalidDummyWrapper(Class<BjsExport> realImplementation) { super(realImplementation); }
        @BjsNativeWrapperTypeInfo.Exporter
        static void exporter(BjsNativeExports nativeExport) {}
    }

    @BjsTypeInfo.BjsLocation(project = "dummy", module = "ValidDummyWrapper")
    private static class ValidDummyWrapper extends BjsNativeWrapper<BjsExport> {
        public static BjsNativeExports capturedNativeExport = null;
        protected ValidDummyWrapper(Class<BjsExport> realImplementation) { super(realImplementation); }
        @BjsNativeWrapperTypeInfo.Exporter
        static BjsNativeExports exporter(BjsNativeExports nativeExport) {
            capturedNativeExport = nativeExport;
            return nativeExport;
        }
        @BjsNativeWrapperTypeInfo.Binder
        static void bjsBind_(BjsNativeExports nativeExport) {}
    }

    @BeforeEach
    public void before() {
        runtime = new JSRuntimeForTest(null, null, null, null);
        FunctionCallback<?>[] callbacks = prepareForAssertGlobalSetting(runtime, new String[]{
                "setTimeout","clearTimeout","bjsNativeRequire","bjsSetModuleLoader"
        });

        context = new BjsContext(runtime, "SomeProject");

        assertEquals(context.setTimeoutCallback, callbacks[0]);
        assertEquals(context.clearTimeoutCallback, callbacks[1]);
        assertEquals(context.bjsNativeRequireCallback, callbacks[2]);
        assertEquals(context.bjsSetModuleLoaderCallback, callbacks[3]);
        runtime.referenceBuilder = null;
        runtime.globalObject = null;
        runtime.resolver = null;
        runtime.scriptRunner = null;
    }

    @Test
    public void addNativeWrappers_invalid() {
        assertThrows(RuntimeException.class, () -> context.addNativeWrapper(InvalidDummyWrapper.class));
    }

    @Test
    public void addNativeWrappers_alreadyAdded() {
        context.addNativeWrapper(ValidDummyWrapper.class);
        assertThrows(RuntimeException.class, () -> context.addNativeWrapper(ValidDummyWrapper.class));
    }

    @Test
    public void getNativeModule() {
        context.addNativeWrapper(ValidDummyWrapper.class);

        assertNull(ValidDummyWrapper.capturedNativeExport);
        runtime.referenceBuilder = jsType -> mock(JSReference.class);
        runtime.resolver = (jsReference, jsType) -> mock(JSObject.class);
        JSReference module = context.getNativeModule("ValidDummyWrapper");
        assertNotNull(ValidDummyWrapper.capturedNativeExport);
        assertEquals(module, ValidDummyWrapper.capturedNativeExport.getExportsObject());
    }

    @Test
    public void createJsNull() {
        runtime.referenceBuilder = jsType -> {
            assertEquals(JSType.Null, jsType);
            return null;
        };

        assertNull(context.createJsNull());
    }

    @Test
    public void createJsUndefined() {
        runtime.referenceBuilder = jsType -> {
            assertEquals(JSType.Undefined, jsType);
            return null;
        };

        assertNull(context.createJsUndefined());
    }

    @Test
    public void resolve() {
        for (JSType type: JSType.values()) {
            JSReference reference = mock(JSReference.class);
            when(reference.getActualType()).thenReturn(type);
            when(reference.getNominalType()).thenReturn(type);

            runtime.resolver = (jsReference, jsType) -> {
                assertEquals(reference, jsReference);
                assertEquals(type, jsType);
                return null;
            };

            assertNull(context.resolve(reference));
        }
    }

    @Test
    public void newBoolean() {
        JSReference reference = newPrimitiveCommonAssert(JSType.Boolean, JSBoolean.class, invocation -> {
            Boolean value = invocation.getArgument(0);
            assertTrue(value);
            return null;
        });
        assertEquals(reference, context.newBoolean(true));
    }

    @Test
    public void newInteger() {
        JSReference reference = newPrimitiveCommonAssert(JSType.Integer, JSInteger.class, invocation -> {
            Integer value = invocation.getArgument(0);
            assertEquals(15964, (int) value);
            return null;
        });
        assertEquals(reference, context.newInteger(15964));
    }

    @Test
    public void newDouble() {
        JSReference reference = newPrimitiveCommonAssert(JSType.Double, JSDouble.class, invocation -> {
            Double value = invocation.getArgument(0);
            assertEquals(173.666e12, value, 0);
            return null;
        });
        assertEquals(reference, context.newDouble(173.666e12));
    }

    @Test
    public void newString() {
        JSReference reference = newPrimitiveCommonAssert(JSType.String, JSString.class, invocation -> {
            String value = invocation.getArgument(0);
            assertEquals("some text", value);
            return null;
        });
        assertEquals(reference, context.newString("some text"));
    }

    @Test
    public void newDate() {
        JSType type = JSType.Date;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);
        JSDate<?> jsValue = mock(JSDate.class);
        Date date = new Date(1584554);

        doAnswer(invocation -> {
            Date value = invocation.getArgument(0);
            assertEquals(date, value);
            return null;
        }).when(jsValue).setValue(any());

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };
        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            assertEquals(reference, jsReference);
            assertEquals(type, jsType);
            return jsValue;
        };

        assertEquals(reference, context.newDate(date));
    }

    @Test
    public void newExternal() {
        JSType type = JSType.External;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);
        JSExternal<ArrayList<String>> jsValue = mock(JSExternal.class);
        ArrayList<String> arrayList = new ArrayList<>();

        doAnswer(invocation -> {
            ArrayList<String> value = invocation.getArgument(0);
            assertEquals(arrayList, value);
            return null;
        }).when(jsValue).setValue(any());

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };
        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            assertEquals(reference, jsReference);
            assertEquals(type, jsType);
            return jsValue;
        };

        assertEquals(reference, context.newExternal(arrayList));
    }

    @Test
    public void newFunction() {
        JSType type = JSType.Function;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);
        JSFunction<?> jsValue = mock(JSFunction.class);
        FunctionCallback<?> callback = jsReferences -> null;

        doAnswer(invocation -> {
            FunctionCallback<?> value = invocation.getArgument(0);
            assertEquals(callback, value);
            return null;
        }).when(jsValue).setFunction(any());

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };
        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            assertEquals(reference, jsReference);
            assertEquals(type, jsType);
            return jsValue;
        };

        assertEquals(reference, context.newFunction(callback));
    }

    @Test
    public void newObject() {
        JSType type = JSType.Object;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };

        assertEquals(reference, context.newObject());
    }

    @Test
    public void newArray() {
        JSType type = JSType.Array;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };

        assertEquals(reference, context.newArray());
    }

    @Test
    public void callFunction() {
        JSType type = JSType.Function;
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);

        JSFunction<?> jsValue = mock(JSFunction.class);

        doAnswer(invocation -> {
            JSReference functionReference = invocation.getArgument(0);
            JSReference parameter1 = invocation.getArgument(1);
            JSReference parameter2 = invocation.getArgument(2);
            JSReference parameter3 = invocation.getArgument(3);
            assertEquals(reference, functionReference);
            assertEquals(reference, parameter1);
            assertEquals(reference, parameter2);
            assertEquals(reference, parameter3);

            return reference;
        }).when(jsValue).invoke(any(), any());

        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            assertEquals(reference, jsReference);
            assertEquals(type, jsType);
            return jsValue;
        };

        assertEquals(reference, context.callFunction(reference, reference, reference, reference, reference));
    }

    @Test
    public void executeJs() {
        runtime.scriptRunner = (name, script) -> {
            assertEquals("script", script);
            return null;
        };

        assertNull(context.executeJs("script"));
    }

    @Test
    public void executeJs_withPath() {
        runtime.scriptRunner = (name, script) -> {
            assertEquals("path", name);
            assertEquals("script", script);
            return null;
        };

        assertNull(context.executeJs("script", "path"));
    }

    @Test
    public void logError() {
        PrintStream original = System.err;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setErr(new PrintStream(out));

        context.logError("Some error");
        assertEquals(String.format("Bjs \"SomeProject\" error: Some error%n"), out.toString());

        System.setErr(original);
    }

    @Test
    public void logInfo() {
        PrintStream original = System.out;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        context.logInfo("Some info");
        assertEquals(String.format("Bjs \"SomeProject\" info: Some info%n"), out.toString());

        System.setOut(original);
    }

    private <T extends JSPrimitive<?>> JSReference newPrimitiveCommonAssert(JSType type, Class<T> tClass, Answer setAnswer) {
        JSReference reference = mock(JSReference.class);
        when(reference.getActualType()).thenReturn(type);
        when(reference.getNominalType()).thenReturn(type);
        T jsValue = mock(tClass);

        doAnswer(setAnswer).when(jsValue).setValue(any());

        runtime.referenceBuilder = jsType -> {
            assertEquals(type, jsType);
            return reference;
        };
        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            assertEquals(reference, jsReference);
            assertEquals(type, jsType);
            return jsValue;
        };

        return reference;
    }

    private static FunctionCallback<?>[] prepareForAssertGlobalSetting(JSRuntimeForTest runtime, String[] names) {
        FunctionCallback<?>[] callbacks = new FunctionCallback[names.length];

        JSReference functionReference = mock(JSReference.class);
        when(functionReference.getActualType()).thenReturn(JSType.Function);
        when(functionReference.getNominalType()).thenReturn(JSType.Function);

        int[] funcCounter = new int[1];
        JSFunction<?> jsFunction = mock(JSFunction.class);
        doAnswer(invocation -> {
            callbacks[funcCounter[0]] = invocation.getArgument(0);
            return null;
        }).when(jsFunction).setFunction(any());

        JSReference objectReference = mock(JSReference.class);
        when(objectReference.getActualType()).thenReturn(JSType.Object);
        when(objectReference.getNominalType()).thenReturn(JSType.Object);

        JSObject<?> jsObject = mock(JSObject.class);

        int[] refCounter = new int[1];
        runtime.referenceBuilder = jsType -> {
            refCounter[0]++;
            if (refCounter[0] <= callbacks.length)
            {
                assertEquals(JSType.Function, jsType);
                return functionReference;
            }
            else if (refCounter[0] == callbacks.length + 1)
            {
                assertEquals(JSType.Object, jsType);
                return objectReference;
            }
            return null;
        };

        runtime.resolver = (JSReference jsReference, JSType jsType) -> {
            if (jsType == JSType.Function)
            {
                assertEquals(functionReference, jsReference);
                return jsFunction;
            } else if (jsType == JSType.Object) {
                assertEquals(objectReference, jsReference);
                return jsObject;
            }
            return null;
        };

        runtime.globalObject = (JSObject<JSReference>) mock(JSObject.class);
        doAnswer(invocation -> {
            if (funcCounter[0] < names.length)
            {
                String name = invocation.getArgument(0);
                JSReference function = invocation.getArgument(1);

                assertEquals(names[funcCounter[0]], name);
                assertEquals(functionReference, function);
                funcCounter[0]++;
            } else {
                String name = invocation.getArgument(0);
                JSReference process = invocation.getArgument(1);

                assertEquals("process", name);
                assertEquals(objectReference, process);
            }
            return null;
        }).when(runtime.globalObject).set(any(), any());

        return callbacks;
    }
}
