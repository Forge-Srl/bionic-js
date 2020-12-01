package bionic.js;

import bionic.js.testutils.TestWithBjsMock;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BjsLocatorTest extends TestWithBjsMock
{
    @Test
    public void ctor()
    {
        BjsLocator locator = new BjsLocator();
        assertEquals("", locator.packageName);
        assertEquals("", locator.projectName);
        assertEquals("", locator.moduleName);

        locator = new BjsLocator("package", "project", "module");
        assertEquals("package", locator.packageName);
        assertEquals("project", locator.projectName);
        assertEquals("module", locator.moduleName);
    }

    @Test
    public void isInvalid_missingProject()
    {
        BjsLocator locator = new BjsLocator("package", "", "module");
        assertTrue(locator.isInvalid());
    }

    @Test
    public void isInvalid_missingModule()
    {
        BjsLocator locator = new BjsLocator("package", "project", "");
        assertTrue(locator.isInvalid());
    }

    @Test
    public void isInvalid_missingProjectAndModule()
    {
        BjsLocator locator = new BjsLocator("package", "", "");
        assertTrue(locator.isInvalid());
    }

    @Test
    public void isInvalid()
    {
        BjsLocator locator = new BjsLocator("package", "project", "module");
        assertFalse(locator.isInvalid());
    }

    @Test
    public void get()
    {
        BjsLocator locator = new BjsLocator(BJS_TEST_PACKAGE, BJS_TEST_PROJECT, "module");
        assertEquals(bjs, locator.get());
        assertEquals(bjs, locator.get());
        assertEquals(bjs, locator.get());
    }
}
