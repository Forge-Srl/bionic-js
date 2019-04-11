import XCTest
import JavaScriptCore

class BjsLibTest: XCTestCase {
    
    let bjsClassFactory = { (jsValue: JSValue) -> BjsClass in
        return BjsClass(jsValue)
    }
    
    class BjsClass2: BjsClass { }
    let bjsClass2Factory = { (jsValue: JSValue) -> BjsClass2 in
        return BjsClass2(jsValue)
    }
    
    var jsInstance1: JSValue!
    var jsInstance2: JSValue!
    
    override func setUp() {
        super.setUp()
        Bjs.get.clearJsEnvironment()
        jsInstance1 = Bjs.get.context.jsContext.evaluateScript("{test:'instance1'}");
        jsInstance2 = Bjs.get.context.jsContext.evaluateScript("{test:'instance2'}");
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func test_bjsObject_differentJsInstances() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsClassFactory)
        let instance2 = Bjs.get.getObj(jsInstance2, bjsClassFactory)
        XCTAssertNotEqual(instance1, instance2)
    }
    
    func test_bjsObject_sameInstances_sameTypes() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsClassFactory)
        let instance1Again = Bjs.get.getObj(jsInstance1) { (jsValue: JSValue) -> BjsClass in
            XCTFail("Factory shouldn't be called again")
            return BjsClass(jsValue)
        }
        XCTAssertEqual(instance1, instance1Again)
    }
    
    func test_bjsObject_sameInstances_differentTypes() {
        let instance1 = Bjs.get.getObj(jsInstance1, bjsClassFactory)
        let instance1DifferentType = Bjs.get.getObj(jsInstance1, bjsClass2Factory);
        XCTAssertNotEqual(instance1, instance1DifferentType)
        XCTAssertEqual(instance1?.bjsObj, instance1DifferentType?.bjsObj)
        
        let instance1Again = Bjs.get.getObj(jsInstance1, bjsClassFactory)
        let instance1DifferentTypeAgain = Bjs.get.getObj(jsInstance1, bjsClass2Factory);
        
        XCTAssertEqual(instance1, instance1Again)
        XCTAssertEqual(instance1?.bjsObj, instance1Again?.bjsObj)
        XCTAssertEqual(instance1DifferentType, instance1DifferentTypeAgain)
        XCTAssertEqual(instance1DifferentType?.bjsObj, instance1DifferentTypeAgain?.bjsObj)
    }
}

