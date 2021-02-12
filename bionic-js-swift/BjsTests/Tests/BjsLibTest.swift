import XCTest
import JavaScriptCore

class BjsLibTest: XCTestCase {
    
    class Context1Obj1: BjsObject {
        open class override var bjsLocator: BjsLocator { BjsLocator("context1", "") }
        class func bjsFactory(_ jsObject: JSValue) -> Context1Obj1 { Context1Obj1(jsObject)}
    }
    
    class Context1Obj2: BjsObject {
        open class override var bjsLocator: BjsLocator { BjsLocator("context1", "") }
        class func bjsFactory(_ jsObject: JSValue) -> Context1Obj2 { Context1Obj2(jsObject)}
    }
    
    class Context2Obj3: BjsObject {
        open class override var bjsLocator: BjsLocator { BjsLocator("context2", "") }
        class func bjsFactory(_ jsObject: JSValue) -> Context2Obj3 { Context2Obj3(jsObject)}
    }
    
    var instance1: JSValue!
    var instance2: JSValue!
    var instance3: JSValue!
        
    override func setUp() {
        super.setUp()
        
        Context1Obj1.bjs.loadBundle(BjsLibTest.self, "test")
        Context2Obj3.bjs.loadBundle(BjsLibTest.self, "test")
        
        instance1 = Context1Obj1.bjs.context.jsContext.evaluateScript("{test:'instance1'}");
        instance2 = Context1Obj2.bjs.context.jsContext.evaluateScript("{test:'instance2'}");
        instance3 = Context2Obj3.bjs.context.jsContext.evaluateScript("{test:'instance3'}");
    }
    
    func test_BjsObject_equality_sameContext_differentInstances() {
        XCTAssertEqual(Context1Obj1.bjs.context.jsContext, Context1Obj2.bjs.context.jsContext)
        
        let obj1 = Context1Obj1.bjs.getObj(instance1, Context1Obj1.bjsFactory)
        let obj2 = Context1Obj2.bjs.getObj(instance2, Context1Obj2.bjsFactory)
        XCTAssertNotEqual(obj1, obj2)
    }
    
    func test_BjsObject_equality_differentContexts() {
        XCTAssertNotEqual(Context1Obj1.bjs.context.jsContext, Context2Obj3.bjs.context.jsContext)
        
        let obj1 = Context1Obj1.bjs.getObj(instance1, Context1Obj1.bjsFactory)
        let obj3 = Context2Obj3.bjs.getObj(instance2, Context2Obj3.bjsFactory)
        XCTAssertNotEqual(obj1, obj3)
    }
    
    func test_BjsObject_equality_sameContext_sameInstances() {
        let obj1 = Context1Obj1.bjs.getObj(instance1, Context1Obj1.bjsFactory)
        let obj1Clone = Context1Obj1.bjs.getObj(instance1) { (jsValue: JSValue) -> Context1Obj1 in
            XCTFail("Factory shouldn't be called again")
            return Context1Obj1(jsValue)
        }
        XCTAssertEqual(obj1, obj1Clone)
        XCTAssertTrue(obj1 == obj1Clone)
    }
    
    func test_bjsObject_equality_sameContext_sameInstances_differentTypes() {
        let obj1 = Context1Obj1.bjs.getObj(instance1, Context1Obj1.bjsFactory)
        let obj1DifferentType = Context1Obj1.bjs.getObj(instance1, Context1Obj2.bjsFactory)
        let obj1DifferentTypeClone = Context1Obj1.bjs.getObj(instance1, Context1Obj2.bjsFactory)
        let obj1Clone = Context1Obj1.bjs.getObj(instance1, Context1Obj1.bjsFactory)
        
        XCTAssertEqual(obj1, obj1Clone)
        XCTAssertEqual(obj1, obj1DifferentType)
        XCTAssertEqual(obj1, obj1DifferentTypeClone)
        
        XCTAssertTrue(obj1!.bjsObj === obj1DifferentType!.bjsObj)
        
        XCTAssertTrue(obj1 === obj1Clone)
        XCTAssertTrue(obj1 !== obj1DifferentType)
        XCTAssertTrue(obj1 !== obj1DifferentTypeClone)
    }
}

