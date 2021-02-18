package bionic.js;

import jjbridge.api.runtime.JSReference;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.mock;

public class BjsNativeObjectIdentifierTest {
    @Test
    public void ctor() {
        JSReference reference = mock(JSReference.class);
        Class<String> clazz = String.class;
        BjsNativeObjectIdentifier<String> identifier = new BjsNativeObjectIdentifier<>(reference, clazz);
        BjsNativeObjectIdentifier<String> identifier2 = new BjsNativeObjectIdentifier<>(reference, clazz);

        assertEquals(reference.hashCode() * 997 + clazz.hashCode(), identifier.hashCode());
        assertNotEquals(reference.hashCode() * 997 + Object.class.hashCode(), identifier.hashCode());
        assertNotEquals(mock(JSReference.class).hashCode() * 997 + Object.class.hashCode(), identifier.hashCode());

        assertEquals(identifier.hashCode(), identifier2.hashCode());
    }
}
