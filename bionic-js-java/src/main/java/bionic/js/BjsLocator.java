package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;

public class BjsLocator
{
    private Bjs bjs;

    final String projectName;
    final String moduleName;
    final String packageName;

    public BjsLocator()
    {
        this("", "", "");
    }

    public BjsLocator(String packageName, @NonNull String projectName, @NonNull String moduleName)
    {
        this.packageName = packageName;
        this.projectName = projectName;
        this.moduleName = moduleName;
    }

    public boolean isInvalid()
    {
        return projectName.isEmpty() || moduleName.isEmpty();
    }

    public Bjs get()
    {
        if (bjs == null)
        {
            bjs = Bjs.get(packageName, projectName);
        }
        return bjs;
    }
}
