package bionic.js.testutils;

import bionic.js.BjsObject;
import bionic.js.BjsTypeInfo;
import jjbridge.api.runtime.JSReference;

@BjsTypeInfo.BjsLocation(project = TestWithBjsMock.BJS_TEST_PROJECT, module = "DummyBjsObjectForTest")
public class DummyBjsObjectForTest extends BjsObject
{
    public DummyBjsObjectForTest(JSReference jsObject)
    {
        super(DummyBjsObjectForTest.class, jsObject);
    }

    public DummyBjsObjectForTest(JSReference[] arguments)
    {
        super(DummyBjsObjectForTest.class, arguments);
    }
}