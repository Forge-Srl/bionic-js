import XCTest
import JavaScriptCore

class BjsLibTest: XCTestCase {
    
    let bjsObjectFactory = { (jsValue: JSValue) -> BjsObject in
        return BjsObject(jsValue)
    }
    
    class BjsObject2: BjsObject { }
    let bjsObject2Factory = { (jsValue: JSValue) -> BjsObject2 in
        return BjsObject2(jsValue)
    }
    
    var jsInstance1: JSValue!
    var jsInstance2: JSValue!
    
    override func setUp() {
        super.setUp()
        Bjs.setBundle(BjsLibTest.self, "test")
        Bjs.get.clearJsEnvironment()
        jsInstance1 = Bjs.get.context.jsContext.evaluateScript("{test:'instance1'}");
        jsInstance2 = Bjs.get.context.jsContext.evaluateScript("{test:'instance2'}");
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func test_bjsObject_differentJsInstances() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsObjectFactory)
        let instance2 = Bjs.get.getObj(jsInstance2, bjsObjectFactory)
        XCTAssertNotEqual(instance1, instance2)
    }
    
    func test_bjsObject_sameInstances_sameTypes() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsObjectFactory)
        let instance1Again = Bjs.get.getObj(jsInstance1) { (jsValue: JSValue) -> BjsObject in
            XCTFail("Factory shouldn't be called again")
            return BjsObject(jsValue)
        }
        XCTAssertEqual(instance1, instance1Again)
    }
    
    func test_bjsObject_sameInstances_differentTypes() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsObjectFactory)
        let instance1DifferentType = Bjs.get.getObj(jsInstance1, bjsObject2Factory);
        XCTAssertEqual(instance1, instance1DifferentType)
        XCTAssertEqual(instance1?.bjsObj, instance1DifferentType?.bjsObj)
        
        let instance1Again = Bjs.get.getObj(jsInstance1, bjsObjectFactory)
        let instance1DifferentTypeAgain = Bjs.get.getObj(jsInstance1, bjsObject2Factory);
        
        XCTAssertEqual(instance1, instance1Again)
        XCTAssertEqual(instance1?.bjsObj, instance1Again?.bjsObj)
        XCTAssertEqual(instance1DifferentType, instance1DifferentTypeAgain)
        XCTAssertEqual(instance1DifferentType?.bjsObj, instance1DifferentTypeAgain?.bjsObj)
    }
}

