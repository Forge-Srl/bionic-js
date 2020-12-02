package bionic.js;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BjsBundleTest
{
    private static final String bundleName = "bundleName";
    private static final List<CharSequence> fileLines = Arrays.asList(
            "Line 1",
            "Line 2 with some other text 🤯 | 👽 | 👾 | 🤖 | ֍ | ▣",
            "Other text\t\t& random characters",
            "",
            "",
            "",
            "Last Line"
    );

    @Mock private ClassLoader loader;
    @Spy private BjsBundle bundle = new BjsBundle(BjsBundleTest.class, bundleName);
    @TempDir Path tempDirPath;

    @BeforeEach
    public void beforeEach()
    {
        assertEquals(bundleName, bundle.name);
        lenient().when(bundle.getLoader()).thenReturn(loader);
    }

    @Test
    public void getFullPathName()
    {
        assertEquals(bundleName + ".bundle", bundle.getFullPathName("/"));
        assertEquals(bundleName + ".bundle/some/custom/path", bundle.getFullPathName("/some/custom/path"));
        assertEquals(bundleName + ".bundle/some/custom/path", bundle.getFullPathName("some/custom/path"));
        assertEquals(bundleName + ".bundle/_123", bundle.getFullPathName("/_123"));
        assertEquals(bundleName + ".bundle/_123", bundle.getFullPathName("_123"));
        assertEquals(bundleName + ".bundle/other/xxx/", bundle.getFullPathName("/other/xxx/"));
        assertEquals(bundleName + ".bundle/other/xxx/", bundle.getFullPathName("other/xxx/"));
    }

    @Test
    public void loadFile_OutsideJar() throws IOException
    {
        Path tempFile = tempDirPath.resolve("notExistent.js");
        Files.write(tempFile, fileLines, StandardCharsets.UTF_8);
        when(bundle.getFullPathName("requiredPath")).thenReturn("path");
        when(loader.getResource("path")).thenReturn(tempFile.toUri().toURL());

        assertEquals(String.join("\n", fileLines), bundle.loadFile("requiredPath"));
    }

    @Test
    public void loadFile_InsideJar() throws IOException
    {
        Path tempFile = tempDirPath.resolve("notExistent.js");
        Files.write(tempFile, fileLines, StandardCharsets.UTF_8);
        when(bundle.getFullPathName("requiredPath")).thenReturn("path");
        when(loader.getResource("path")).thenReturn(null);
        when(loader.getResourceAsStream("path")).thenReturn(Files.newInputStream(tempFile));

        assertEquals(String.join("\n", fileLines), bundle.loadFile("requiredPath"));
    }

    @Test
    public void loadFile_NotFound()
    {
        when(bundle.getFullPathName("requiredPath")).thenReturn("path");
        when(loader.getResource("path")).thenReturn(null);
        when(loader.getResourceAsStream("path")).thenReturn(null);

        assertNull(bundle.loadFile("requiredPath"));
    }
}
