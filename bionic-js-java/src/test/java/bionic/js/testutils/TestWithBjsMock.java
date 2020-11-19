package bionic.js.testutils;

import bionic.js.Bjs;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.fail;

@ExtendWith(MockitoExtension.class)
public abstract class TestWithBjsMock {
    @Mock protected Bjs bjs;

    @BeforeEach
    public void beforeEach() {
        // Inject mocked Bjs instance to be returned by Bjs.get()
        mockPrivateStaticField(Bjs.class, "get", bjs);
    }

    @AfterEach
    public void afterEach() {
        // Remove injected mock
        mockPrivateStaticField(Bjs.class, "get", null);
    }

    private static void mockPrivateStaticField(Class<?> clazz, String name, Object value) {
        try
        {
            Field getField = clazz.getDeclaredField(name);
            getField.setAccessible(true);
            getField.set(null, value);
            getField.setAccessible(false);
        } catch (NoSuchFieldException | IllegalAccessException e)
        {
            fail(e.toString());
        }
    }
}
