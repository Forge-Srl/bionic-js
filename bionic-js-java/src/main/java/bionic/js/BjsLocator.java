package bionic.js;

import edu.umd.cs.findbugs.annotations.NonNull;

/**
 * The logical location for a JavaScript class inside a Bjs project.
 * */
public final class BjsLocator
{
    private Bjs bjs;

    final String projectName;
    final String moduleName;
    final String packageName;

    BjsLocator()
    {
        this("", "", "");
    }

    BjsLocator(String packageName, @NonNull String projectName, @NonNull String moduleName)
    {
        this.packageName = packageName;
        this.projectName = projectName;
        this.moduleName = moduleName;
    }

    boolean isInvalid()
    {
        return projectName.isEmpty() || moduleName.isEmpty();
    }

    /**
     * Provides the Bjs environment associated to this location.
     *
     * @return the {@link Bjs} instance
     * */
    public Bjs get()
    {
        if (bjs == null)
        {
            bjs = Bjs.get(packageName, projectName);
        }
        return bjs;
    }
}
