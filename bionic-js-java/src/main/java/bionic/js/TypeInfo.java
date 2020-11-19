package bionic.js;

import java.net.URL;
import java.security.CodeSource;

public abstract class TypeInfo<B>
{
    private final Class<B> clazz;
    private String containingFolder;

    TypeInfo(Class<B> clazz)
    {
        this.clazz = clazz;
    }

    public Class<B> getTypeClass()
    {
        return clazz;
    }

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
