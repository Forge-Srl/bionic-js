import XCTest
import JavaScriptCore

class ToyClass2Test: XCTestCase {
    
    var testDate: Date!
    var testDateTimestamp: Double!
    var toyObj: ToyClass2!
    var toy: ToyClass2!
    
    override func setUp() {
        super.setUp()
        testDateTimestamp = 472867200
        testDate = Date(timeIntervalSince1970: testDateTimestamp)
        toyObj = ToyClass2(false)
        toyObj.log = "any object"
        
        toy = ToyClass2(false)
        XCTAssertEqual(toy.log, "called constructor without params")
    }
    
    
    // CONSTRUCTOR
    
    func testConstructorParam() {
        let toy = ToyClass2(true)
        XCTAssertEqual(toy.log, "called constructor with params: true")
    }
    
    func testConstructorNullParam() {
        let toy = ToyClass2(nil)
        XCTAssertEqual(toy.log, "called constructor without params")
    }
    
    
    // INSTANCE PROPERTIES
    
    func testNativeAutoProp() {
        XCTAssertNil(toy.nativeAutoProp)
        
        toy.nativeAutoProp = "1984!"
        XCTAssertEqual(toy.nativeAutoProp, "1984!")
        
        toy.nativeAutoProp = nil
        XCTAssertNil(toy.nativeAutoProp)
    }
    
    func testAnyAutoProp() {
        XCTAssertTrue(toy.anyAutoProp.jsObj.isUndefined)
        
        toy.anyAutoProp = BjsAnyObject(toyObj)
        XCTAssertEqual(toy.anyAutoProp.getObject(ToyClass2.bjsFactory)!.log, "any object")
    }
    
    func testBjsObjAutoProp() {
        XCTAssertNil(toy.bjsObjAutoProp)
        
        toy.bjsObjAutoProp = toyObj
        XCTAssertEqual(toy.bjsObjAutoProp!.log, "any object")
    }
    
    func testLambdaAutoProp() {
        XCTAssertNil(toy.lambdaAutoProp)
        toy.lambdaAutoProp = { string in
            if string == nil {
                return "null!"
            }
            return string! + " 1984!"
        }
        XCTAssertEqual(toy.lambdaAutoProp!(nil), "null!")
        XCTAssertEqual(toy.lambdaAutoProp!("W"), "W 1984!")
        
        toy.lambdaAutoProp = nil
        XCTAssertNil(toy.lambdaAutoProp)
        
        toy.lambdaAutoProp = { string in
            return nil
        }
        XCTAssertEqual(toy.lambdaAutoProp!("x"), nil)
    }
    
    func testLambdaAutoProp_putNilToJs() {
        let nullTest = "(this.lambdaAutoProp() === null)"
        
        toy.lambdaAutoProp = { string in return "hey" }
        toy.evalAndSetValue(nullTest)
        XCTAssertEqual(toy.boolFunc(), false)
        
        toy.lambdaAutoProp = { string in return nil }
        toy.evalAndSetValue(nullTest)
        XCTAssertEqual(toy.boolFunc(), true)
    }
    
    func testNativeArrayAutoProp() {
        XCTAssertNil(toy.nativeArrayAutoProp)
        
        toy.nativeArrayAutoProp = [[["a", "b"]]]
        XCTAssertEqual(toy.nativeArrayAutoProp, [[["a", "b"]]])
        
        toy.nativeArrayAutoProp = [[[], []]]
        XCTAssertEqual(toy.nativeArrayAutoProp, [[[], []]])
        
        toy.nativeArrayAutoProp = [[], []]
        XCTAssertEqual(toy.nativeArrayAutoProp, [[], []])
        
        toy.nativeArrayAutoProp = []
        XCTAssertEqual(toy.nativeArrayAutoProp, [])
        
        toy.nativeArrayAutoProp = [nil, [nil], [[nil]], [["test", nil]]]
        XCTAssertEqual(toy.nativeArrayAutoProp, [nil, [nil], [[nil]], [["test", nil]]])
    }
    
    func testBjsObjArrayAutoProp() {
        XCTAssertNil(toy.bjsObjArrayAutoProp)
        
        toy.bjsObjArrayAutoProp = [[[toyObj]]]
        XCTAssertEqual(toy.bjsObjArrayAutoProp, [[[toyObj]]])
        
        toy.bjsObjArrayAutoProp = [[[], []]]
        XCTAssertEqual(toy.bjsObjArrayAutoProp, [[[], []]])
        
        toy.bjsObjArrayAutoProp = [[], []]
        XCTAssertEqual(toy.bjsObjArrayAutoProp, [[], []])
        
        toy.bjsObjArrayAutoProp = []
        XCTAssertEqual(toy.bjsObjArrayAutoProp, [])
        
        toy.bjsObjArrayAutoProp = [nil, [nil], [[nil]], [[toyObj, nil]]]
        XCTAssertEqual(toy.bjsObjArrayAutoProp, [nil, [nil], [[nil]], [[toyObj, nil]]])
    }
    
    func testAnyArrayAutoProp() {
        XCTAssertNil(toy.anyArrayAutoProp)
        
        let anyObj = BjsAnyObject(toyObj.bjsObj)
        
        toy.anyArrayAutoProp = [[[ anyObj ]]]
        XCTAssertEqual(toy.anyArrayAutoProp![0]![0]![0].getObject(ToyClass2.bjsFactory)?.log, "any object")
        
        toy.anyArrayAutoProp = [[[ ]]]
        XCTAssertTrue(toy.anyArrayAutoProp![0]![0]!.isEmpty)
    }
    
    func testLambdaArrayAutoProp() {
        XCTAssertNil(toy.lambdaArrayAutoProp)
        
        let lambda1a: (_ inStr: String?) -> String? = { ($0 ?? "") + "-1a"}
        let lambda1b: (_ inStr: String?) -> String? = { ($0 ?? "") + "-2a"}
        let lambda2a: (_ inStr: String?) -> String? = { ($0 ?? "") + "-1b"}
        
        toy.lambdaArrayAutoProp = [[[ lambda1a, lambda1b ], [lambda2a, nil] ]]
        
        XCTAssertEqual(toy.lambdaArrayAutoProp![0]![0]![0]!("test"), "test-1a")
        XCTAssertEqual(toy.lambdaArrayAutoProp![0]![0]![1]!("test"), "test-2a")
        XCTAssertEqual(toy.lambdaArrayAutoProp![0]![1]![0]!("test"), "test-1b")
        XCTAssertNil(toy.lambdaArrayAutoProp![0]![1]![1])
        
        toy.lambdaArrayAutoProp = [[[ ]]]
        XCTAssertTrue(toy.lambdaArrayAutoProp![0]![0]!.isEmpty)
    }
    
    func testProp() {
        XCTAssertEqual(toy.prop, "1984!")
        
        toy.prop = "test value"
        XCTAssertEqual(toy.prop, "test value")
        
        toy.prop = nil
        XCTAssertEqual(toy.prop, "1984!")
    }
    
    
    // INSTANCE METHODS
    
    func testVoidFunc() {
        toy.voidFunc()
        XCTAssertEqual(toy.log, "called voidFunc")
    }
    
    func testParamsFunc() {
        let testExpectation = expectation(description: "called")
        toy.paramsFunc(true, testDate, 01.984, 01984, "1984", BjsAnyObject(toyObj.bjsObj), toyObj,
                       [1,2,3]) { () -> String? in
            testExpectation.fulfill()
            return "lambda return value"
        }
        XCTAssertEqual(toy.log, "called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value")
        wait(for: [testExpectation], timeout: 10)
    }
    
    func testParamsFunc_nil() {
        toy.paramsFunc(nil, nil, nil, nil, nil, ToyClass2.bjs.anyNull, nil, nil, nil)
        XCTAssertEqual(toy.log, "called paramsFunc with params: null, null, null, null, null, null, null, null, null")
    }
    
    func testBoolFunc() {
        XCTAssertNil(toy.boolFunc())
        XCTAssertEqual(toy.log, "called retValueFunc")
        
        toy.evalAndSetValue("null")
        XCTAssertNil(toy.boolFunc())
        
        toy.evalAndSetValue("false")
        XCTAssertEqual(toy.boolFunc(), false)
        
        toy.evalAndSetValue("true")
        XCTAssertEqual(toy.boolFunc(), true)
        
        toy.evalAndSetValue("1")
        XCTAssertEqual(toy.boolFunc(), true)
    }
    
    func testDateFunc() {
        XCTAssertNil(toy.dateFunc())
        XCTAssertEqual(toy.log, "called retValueFunc")
        
        toy.evalAndSetValue("null")
        XCTAssertNil(toy.dateFunc())
        
        toy.evalAndSetValue("new Date(\(testDateTimestamp!) * 1000)")
        XCTAssertEqual(toy.dateFunc(), testDate)
    }
    
    func testFloatFunc() {
        XCTAssertNil(toy.floatFunc())
        XCTAssertEqual(toy.log, "called retValueFunc")
        
        toy.evalAndSetValue("null")
        XCTAssertNil(toy.floatFunc())
        
        toy.evalAndSetValue(".1984")
        XCTAssertEqual(toy.floatFunc(), 0.1984)
        
        toy.evalAndSetValue("123456789.123456789")
        XCTAssertEqual(toy.floatFunc(), 123456789.123456789)
    }
    
    func testIntFunc() {
        XCTAssertNil(toy.intFunc())
        XCTAssertEqual(toy.log, "called retValueFunc")
        
        toy.evalAndSetValue("null")
        XCTAssertNil(toy.intFunc())
        
        toy.evalAndSetValue("1984")
        XCTAssertEqual(toy.intFunc(), 1984)
        
        toy.evalAndSetValue("1234567890")
        XCTAssertEqual(toy.intFunc(), 1234567890)
    }
    
    func testStringFunc() {
        XCTAssertNil(toy.stringFunc())
        XCTAssertEqual(toy.log, "called retValueFunc")
        
        toy.evalAndSetValue("null")
        XCTAssertNil(toy.stringFunc())
        
        toy.evalAndSetValue("'hello 84! 👋'")
        XCTAssertEqual(toy.stringFunc(), "hello 84! 👋")
    }
    
    func testLambdaVoidFunc() {
        let testExpectation = expectation(description: "called")
        
        let jsLambda = toy.lambdaVoidFunc {
            XCTAssertEqual(self.toy.log, "calling lambda")
            testExpectation.fulfill()
        }
        XCTAssertEqual(toy.log, "called lambdaVoidFunc")
        jsLambda!()
        wait(for: [testExpectation], timeout: 10)
        
        let nilLambda = toy.lambdaVoidFunc(nil)
        XCTAssertNil(nilLambda)
    }
    
    func testLambdaVoidFunc_nil() {
        let nilLambda = toy.lambdaVoidFunc(nil)
        XCTAssertNil(nilLambda)
    }
    
    func testLambdaWithParamsFunc() {
        let testExpectation = expectation(description: "called")
        toy.lambdaWithParamsFunc { (int, nullStr, any, obj) in
            XCTAssertEqual(self.toy.log, "called lambdaWithParamsFunc")
            XCTAssertEqual(int, 1984)
            XCTAssertNil(nullStr)
            XCTAssertEqual(any.getObject(ToyClass2.bjsFactory)?.log, "hello 84")
            XCTAssertEqual(obj?.log, "hello 84")
            testExpectation.fulfill()
            return "1984!"
        }
        XCTAssertEqual(toy.log, "called lambda with result: 1984!")
        wait(for: [testExpectation], timeout: 10)
    }
    
    func testReturningLambdaWithParamsFunc() {
        let lambda = toy.returningLambdaWithParamsFunc()
        XCTAssertEqual(toy.log, "called returningLambdaWithParamsFunc")
        let lambdaRetValue = lambda!(1984, BjsAnyObject(toyObj.bjsObj), toyObj, [1,2,3])
        XCTAssertEqual(toy.log, "called returned lambda with params: 1984, any object, any object, [1,2,3]")
        XCTAssertEqual(lambdaRetValue, "lambda returning value")
    }
    
    func testReturningLambdaWithParamsFunc_nil() {
        let lambda = toy.returningLambdaWithParamsFunc()
        XCTAssertEqual(toy.log, "called returningLambdaWithParamsFunc")
        let lambdaRetValue = lambda!(nil, ToyClass2.bjs.anyNull, nil, nil)
        XCTAssertEqual(toy.log, "called returned lambda with params: null, null, null, null")
        XCTAssertEqual(lambdaRetValue, "lambda returning value")
    }
}
