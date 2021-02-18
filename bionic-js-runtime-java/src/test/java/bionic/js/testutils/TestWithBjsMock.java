package bionic.js.testutils;

import bionic.js.Bjs;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.fail;

@ExtendWith(MockitoExtension.class)
public abstract class TestWithBjsMock {
    @Mock protected Bjs bjs;
    private Map<String, Bjs> projects;

    public static final String BJS_TEST_PACKAGE = "bionic.js.testutils";
    public static final String BJS_TEST_PROJECT = "MockedTestProject";

    @BeforeEach
    public void beforeEach() {
        projects = new HashMap<>();
        exposeMockedBjsTo(BJS_TEST_PACKAGE);
        // Inject mocked Bjs instance to be returned by Bjs.get(projectName)
        mockPrivateStaticField(Bjs.class, "projects", projects);
    }

    @AfterEach
    public void afterEach() {
        // Remove injected mock
        mockPrivateStaticField(Bjs.class, "projects", new HashMap<>());
        projects.clear();
    }

    public void exposeMockedBjsTo(String packageName) {
        projects.put(packageName + ".Bjs" + BJS_TEST_PROJECT, bjs);
    }

    private static void mockPrivateStaticField(Class<?> clazz, String name, Object value)
    {
        try
        {
            Field getField = clazz.getDeclaredField(name);
            getField.setAccessible(true);
            Field modifiersField = Field.class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(getField, getField.getModifiers() & ~Modifier.FINAL);
            getField.set(null, value);
            modifiersField.setInt(getField, getField.getModifiers() & Modifier.FINAL);
            modifiersField.setAccessible(false);
            getField.setAccessible(false);
        }
        catch (NoSuchFieldException | IllegalAccessException e)
        {
            fail(e.toString());
        }
    }
}
