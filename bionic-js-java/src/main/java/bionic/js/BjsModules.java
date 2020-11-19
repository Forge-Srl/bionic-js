package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.runtime.JSRuntime;
import jjbridge.api.value.JSArray;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSString;
import jjbridge.api.value.JSType;
import jjbridge.api.value.strategy.FunctionCallback;

import java.util.HashMap;

class BjsModules extends BjsContext
{
    private static final String bootstrapFile = "bootstrap.js";
    private JSReference nodeJsModule;
    private final BjsBundle bootstrapBundle;
    private final HashMap<String, BjsNativeWrapperTypeInfo<?>> nativeWrappers;
    final BjsBundle appBundle;

    BjsModules(JSRuntime runtime, BjsBundle appBundle)
    {
        this(runtime, appBundle, "BjsBootstrap");
    }

    BjsModules(JSRuntime runtime, BjsBundle appBundle, String bootstrapBundleName)
    {
        super(runtime);
        this.appBundle = appBundle;
        this.bootstrapBundle = new BjsBundle(getClass(), bootstrapBundleName);
        this.nativeWrappers = new HashMap<>();
    }

    JSReference load(String modulePath)
    {
        JSObject<?> nodeJsModule = resolve(getNodeJsModule());
        JSReference load = nodeJsModule.get("_load");
        return callFunction(load, load, newString(modulePath), createJsNull(), newBoolean(false));
    }

    <B extends BjsNativeWrapper<?>> void addNativeWrappers(BjsNativeWrapperTypeInfo<B> nativeWrapperClass)
    {
        if (nativeWrapperClass.name.isEmpty() || nativeWrapperClass.wrapperPath.isEmpty())
        {
            throw new RuntimeException("invalid native wrapper");
        }

        if (nativeWrappers.containsKey(nativeWrapperClass.name))
        {
            throw new RuntimeException("native wrapper " + nativeWrapperClass.name + " was already added");
        }

        nativeWrappers.put(nativeWrapperClass.name, nativeWrapperClass);
    }

    void removeAllNativeWrappers()
    {
        nativeWrappers.clear();
    }

    void clearNodeLoader()
    {
        nodeJsModule = null;
    }

    private JSReference getNodeJsModule()
    {
        if (nodeJsModule == null)
        {
            runBootstrapCode();
        }
        return nodeJsModule;
    }

    private void runBootstrapCode()
    {
        BjsNativeExports nativeExport = createNativeExports()
                .exportFunction("executeContent", executeContentFunction())
                .exportFunction("executeFile", executeFileFunction())
                .exportFunction("fileStat", fileStatFunction())
                .exportFunction("readFile", readFileFunction())
                .exportFunction("isInternalModule", isInternalModuleFunction())
                .exportFunction("getInternalModule", getInternalModuleFunction());

        String bootstrapCode = bootstrapBundle.loadFile(bootstrapFile);
        if (bootstrapCode == null)
        {
            throw new RuntimeException(String.format("Cannot find '%s' in bundle '%s'", bootstrapFile, appBundle.name));
        }

        JSReference bootstrapFunction = executeJs("(" + bootstrapCode + ")",
                String.format("bundle/%s/%s", appBundle.name, bootstrapFile));
        nodeJsModule = callFunction(bootstrapFunction, bootstrapFunction, nativeExport.getExportsObject());
    }

    private FunctionCallback<?> executeContentFunction()
    {
        return jsReferences ->
        {
            String fileContent = ((JSString) resolve(jsReferences[0])).getValue();
            String filePath = ((JSString) resolve(jsReferences[1])).getValue();
            JSReference tailCode = jsReferences.length == 4 ? jsReferences[3] : createJsUndefined();
            executeJsContent(fileContent, filePath, jsReferences[2], tailCode);

            return createJsUndefined();
        };
    }

    private FunctionCallback<?> executeFileFunction()
    {
        return jsReferences ->
        {
            String filePath = ((JSString) resolve(jsReferences[0])).getValue();

            String fileContent = bootstrapBundle.loadFile(filePath);
            if (fileContent == null)
            {
                throw new RuntimeException("JS file not found: " + filePath);
            }

            JSReference tailCode = jsReferences.length == 3 ? jsReferences[2] : createJsUndefined();
            executeJsContent(fileContent, filePath, jsReferences[1], tailCode);

            return createJsUndefined();
        };
    }

    private void executeJsContent(String fileContent, String filePath, JSReference globals, JSReference tailCode)
    {
        JSArray<?> moduleGlobals = resolve(globals);
        int size = moduleGlobals.size();
        String[] globalsNames = new String[size];
        JSReference[] globalsValues = new JSReference[size];

        for (int i = 0; i < size; i++)
        {
            JSArray<?> global = resolve(moduleGlobals.get(i));
            globalsNames[i] = ((JSString) resolve(global.get(0))).getValue();
            globalsValues[i] = global.get(1);
        }

        String globalParameters = String.join(",", globalsNames);
        String tailCodeString = tailCode.getNominalType() == JSType.Undefined
                ? ""
                : "\n" + ((JSString) resolve(tailCode)).getValue();

        String function = String.format("(function(%s){%s%s})", globalParameters, fileContent, tailCodeString);
        JSReference functionToCall = executeJs(function, filePath);
        callFunction(functionToCall, functionToCall, globalsValues);
    }

    private FunctionCallback<?> fileStatFunction()
    {
        return jsReferences ->
        {
            String path = ((JSString) resolve(jsReferences[0])).getValue();
            return newInteger(appBundle.getFileStat(path));
        };
    }

    private FunctionCallback<?> readFileFunction()
    {
        return jsReferences ->
        {
            String path = ((JSString) resolve(jsReferences[0])).getValue();

            String fileContent = appBundle.loadFile(path);
            if (fileContent == null)
            {
                throw new RuntimeException("File not found: " + path);
            }

            return newString(fileContent);
        };
    }

    private FunctionCallback<?> isInternalModuleFunction()
    {
        return jsReferences ->
        {
            String moduleName = ((JSString) resolve(jsReferences[0])).getValue();
            return newBoolean(nativeWrappers.containsKey(moduleName));
        };
    }

    private FunctionCallback<?> getInternalModuleFunction()
    {
        return jsReferences ->
        {
            String moduleName = ((JSString) resolve(jsReferences[0])).getValue();
            return nativeWrappers.get(moduleName).bjsGetNativeFunctions(this);
        };
    }
}
