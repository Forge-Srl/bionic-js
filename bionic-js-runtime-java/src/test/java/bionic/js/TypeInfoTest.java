package bionic.js;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TypeInfoTest {
    static class DummyTypeInfo<T> extends TypeInfo<T> {
        DummyTypeInfo(Class<T> clazz) {
            super(clazz);
        }
    }

    @Test
    public void getTypeClass() {
        assertEquals(String.class, new DummyTypeInfo<>(String.class).getTypeClass());
        assertEquals(Integer.class, new DummyTypeInfo<>(Integer.class).getTypeClass());
        assertEquals(DummyTypeInfo.class, new DummyTypeInfo<>(DummyTypeInfo.class).getTypeClass());
    }

    @Test
    public void containingFolder() {
        assertEquals(TypeInfoTest.class.getProtectionDomain().getCodeSource().getLocation().getPath(),
                new DummyTypeInfo<>(TypeInfoTest.class).containingFolderPath());
        assertEquals(DummyTypeInfo.class.getProtectionDomain().getCodeSource().getLocation().getPath(),
                new DummyTypeInfo<>(DummyTypeInfo.class).containingFolderPath());

        // Java standard types have native code source which means the folder path is empty
        assertEquals("", new DummyTypeInfo<>(String.class).containingFolderPath());
        assertEquals("", new DummyTypeInfo<>(List.class).containingFolderPath());
    }
}
