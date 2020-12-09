package bionic.js;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BjsNativeWrapperTest
{
    static class ClassToAccess implements BjsExport {
        public static String checkValue;
        public static void method1(String value) { checkValue = value; }
        public static Integer method2() { return 3; }
        public static Integer methodOnlyInSuper() { return 1000; }

        public final String something;
        public ClassToAccess(String value) {
            something = value;
        }
    }

    static class SubclassToAccess extends ClassToAccess {
        public static String checkValue;
        public static void method1(String value) { checkValue = "SUBVALUE" + value; }
        public static Integer method2() { return 10; }

        public final String somethingElse;
        public SubclassToAccess(String value) {
            super("superValue");
            somethingElse = value;
        }
    }

    static class Wrapper<T extends BjsExport> extends BjsNativeWrapper<T> {
        protected Wrapper(Class<T> realImplementation)
        {
            super(realImplementation);
        }
    }

    private Wrapper<ClassToAccess> wrapper;
    private Wrapper<SubclassToAccess> subwrapper;

    @BeforeEach
    public void before() {
        wrapper = new Wrapper<>(ClassToAccess.class);
        subwrapper = new Wrapper<>(SubclassToAccess.class);
        ClassToAccess.checkValue = null;
        SubclassToAccess.checkValue = null;
    }

    @Test
    public void invokeStatic_missing_method() {
        assertThrows(RuntimeException.class, () -> wrapper.invokeStatic("missing", new Class[]{}, new Object[]{}));
    }

    @Test
    public void invokeStatic_method1() {
        assertNull(ClassToAccess.checkValue);
        wrapper.invokeStatic("method1", new Class[]{String.class}, new Object[]{"some value"});
        assertEquals("some value", ClassToAccess.checkValue);
    }

    @Test
    public void invokeStatic_method2() {
        Integer result = wrapper.invokeStatic("method2", new Class[]{}, new Object[]{});
        assertEquals(ClassToAccess.method2(), result);
    }

    @Test
    public void invokeStatic_method1_subclass() {
        assertNull(ClassToAccess.checkValue);
        assertNull(SubclassToAccess.checkValue);
        subwrapper.invokeStatic("method1", new Class[]{String.class}, new Object[]{"some value"});
        assertNull(ClassToAccess.checkValue);
        assertEquals("SUBVALUEsome value", SubclassToAccess.checkValue);
    }

    @Test
    public void invokeStatic_method2_subclass() {
        Integer result = wrapper.invokeStatic("method2", new Class[]{}, new Object[]{});
        Integer subresult = subwrapper.invokeStatic("method2", new Class[]{}, new Object[]{});
        assertEquals(SubclassToAccess.method2(), subresult);
        assertNotEquals(SubclassToAccess.method2(), result);
    }

    @Test
    public void invokeStatic_methodOnlyInSuper() {
        Integer result = wrapper.invokeStatic("methodOnlyInSuper", new Class[]{}, new Object[]{});
        Integer subresult = subwrapper.invokeStatic("methodOnlyInSuper", new Class[]{}, new Object[]{});
        assertEquals(ClassToAccess.methodOnlyInSuper(), result);
        assertEquals(ClassToAccess.methodOnlyInSuper(), subresult);
        assertEquals(SubclassToAccess.methodOnlyInSuper(), result);
        assertEquals(SubclassToAccess.methodOnlyInSuper(), subresult);
    }

    @Test
    public void invokeConstructor_missing() {
        assertThrows(RuntimeException.class, () -> wrapper.invokeConstructor(new Class[]{Integer.class, Double.class}, new Object[]{}));
    }

    @Test
    public void invokeConstructor() {
        ClassToAccess result = wrapper.invokeConstructor(new Class[]{String.class}, new Object[]{"foobar"});
        assertEquals("foobar", result.something);
    }

    @Test
    public void invokeConstructor_subclass() {
        SubclassToAccess result = subwrapper.invokeConstructor(new Class[]{String.class}, new Object[]{"foobar"});
        assertEquals("superValue", result.something);
        assertEquals("foobar", result.somethingElse);
    }
}
