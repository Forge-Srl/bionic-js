package bionic.js;

import edu.umd.cs.findbugs.annotations.CheckForNull;
import edu.umd.cs.findbugs.annotations.NonNull;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

class BjsBundle
{
    private final Class<?> clazz;
    final String name;

    BjsBundle(@NonNull Class<?> forClass, @NonNull String name)
    {
        this.name = name;
        this.clazz = forClass;
    }

    ClassLoader getLoader()
    {
        return clazz.getClassLoader();
    }

    String getFullPathName(@NonNull String requirePath)
    {
        String bundleDir = name + ".bundle";
        return requirePath.equals("/")
                ? bundleDir
                : requirePath.startsWith("/")
                ? String.format("%s%s", bundleDir, requirePath)
                : String.format("%s/%s", bundleDir, requirePath);
    }

    @CheckForNull
    String loadFile(@NonNull String requirePath)
    {
        String filePath = getFullPathName(requirePath);
        Charset charset = StandardCharsets.UTF_8;

        List<String> lines = null;
        try
        {
            // 1. Try to load file assuming it's outside of the jar.
            URL resource = getLoader().getResource(filePath);
            if (resource == null)
            {
                throw new FileNotFoundException(filePath);
            }

            lines = Files.readAllLines(Paths.get(resource.toURI()), charset);
        }
        catch (IOException | URISyntaxException | FileSystemNotFoundException e1)
        {
            // 2. Try to load file assuming it's inside of the jar (i.e. as stream).
            try (InputStream fileStream = getLoader().getResourceAsStream(filePath))
            {
                if (fileStream == null)
                {
                    throw new FileNotFoundException(filePath);
                }

                InputStreamReader in = new InputStreamReader(fileStream, charset);
                BufferedReader reader = new BufferedReader(in);
                lines = reader.lines().collect(Collectors.toList());
                reader.close();
                in.close();
            }
            catch (IOException e2)
            {
                // Ignore.
            }
        }

        return lines == null ? null : String.join("\n", lines);
    }
}
