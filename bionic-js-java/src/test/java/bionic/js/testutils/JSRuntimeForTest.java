package bionic.js.testutils;

import jjbridge.api.runtime.JSBaseRuntime;
import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.JSObject;
import jjbridge.api.value.JSType;
import jjbridge.api.value.JSValue;

public class JSRuntimeForTest extends JSBaseRuntime<JSReference> {

    public JSObject<JSReference> globalObject;
    public Resolver resolver;
    public ScriptRunner scriptRunner;
    public ReferenceBuilder referenceBuilder;

    public JSRuntimeForTest(JSObject<JSReference> globalObject,
                            Resolver resolver,
                            ScriptRunner scriptRunner,
                            ReferenceBuilder referenceBuilder) {
        super();
        this.globalObject = globalObject;
        this.resolver = resolver;
        this.scriptRunner = scriptRunner;
        this.referenceBuilder = referenceBuilder;
    }

    @Override
    protected JSObject<JSReference> getGlobalObject() {
        return globalObject;
    }

    @Override
    protected <T extends JSValue> T resolve(JSReference jsReference, JSType jsType) {
        return (T) resolver.resolve(jsReference, jsType);
    }

    @Override
    protected JSReference runScript(String name, String script) {
        return scriptRunner.runScript(name, script);
    }

    @Override
    protected JSReference createNewReference(JSType jsType) {
        return referenceBuilder.createNewReference(jsType);
    }

    public interface Resolver {
        JSValue resolve(JSReference jsReference, JSType jsType);
    }

    public interface ScriptRunner {
        JSReference runScript(String name, String script);
    }

    public interface ReferenceBuilder {
        JSReference createNewReference(JSType jsType);
    }
}
