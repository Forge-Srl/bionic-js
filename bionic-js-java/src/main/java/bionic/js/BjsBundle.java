package bionic.js;

import java.io.BufferedReader;
import java.io.File;
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
    private static final int FILE = 0;
    private static final int DIRECTORY = 1;
    private static final int NOT_FOUND = -2;

    private final Class<?> clazz;
    final String name;

    BjsBundle(Class<?> forClass, String name)
    {
        this.name = name;
        this.clazz = forClass;
    }

    ClassLoader getLoader()
    {
        return clazz.getClassLoader();
    }

    String getFullPathName(String requirePath)
    {
        String bundleDir = name + ".bundle";
        return requirePath.equals("/")
                ? bundleDir
                : requirePath.startsWith("/")
                ? String.format("%s%s", bundleDir, requirePath)
                : String.format("%s/%s", bundleDir, requirePath);
    }

    int getFileStat(String requirePath)
    {
        String path = getFullPathName(requirePath);
        // 1. Try to load file assuming it's outside of the jar.
        try
        {
            URL resource = getLoader().getResource(path);
            if (resource != null)
            {
                File file = new File(resource.toURI());
                if (file.exists())
                {
                    return file.isDirectory() ? DIRECTORY : FILE;
                }
            }
        }
        catch (URISyntaxException e)
        {
            // Ignore. We try loading the file with a different strategy
        }

        // 2. Try to load file assuming it's inside of the jar (i.e. as stream).
        if (!path.endsWith("/"))
        {
            try (InputStream fileStream = getLoader().getResourceAsStream(path))
            {
                if (fileStream != null)
                {
                    return FILE;
                }
            }
            catch (IOException e)
            {
                // Ignore. We try loading the file with a different strategy
            }
            path = path + "/";
        }

        try (InputStream fileStream = getLoader().getResourceAsStream(path))
        {
            if (fileStream != null)
            {
                return DIRECTORY;
            }
        }
        catch (IOException e)
        {
            // Ignore.
        }

        return NOT_FOUND;
    }

    String loadFile(String requirePath)
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
