package bionic.js;

import java.net.URL;
import java.security.CodeSource;

/**
 * A generic provider of information about the specified type.
 *
 * @param <B> The class type to get information about.
 * */
public abstract class TypeInfo<B>
{
    private final Class<B> clazz;
    private String containingFolder;

    TypeInfo(Class<B> clazz)
    {
        this.clazz = clazz;
    }

    /**
     * Get the instance of the class with respect to which this object provides information.
     *
     * @return The instance of the class
     * */
    public Class<B> getTypeClass()
    {
        return clazz;
    }

    /**
     * Get the file path to the `.class` file of the class with respect to which this object provides information.
     *
     * @return The file path
     * */
    public String containingFolderPath()
    {
        if (containingFolder == null)
        {
            CodeSource codeSource = this.clazz.getProtectionDomain().getCodeSource();
            if (codeSource == null)
            {
                containingFolder = "";
            }
            else
            {
                URL location = codeSource.getLocation();
                containingFolder = location.getPath();
            }
        }
        return containingFolder;
    }
}
