import XCTest
import JavaScriptCore

class ToyClass1Test: XCTestCase {
    
    var testDate: Date!
    var testDateTimestamp: Double!
    var bjsObj: ToyClass1!
    
    override func setUp() {
        super.setUp()
        testDateTimestamp = 472867200
        testDate = Date(timeIntervalSince1970: testDateTimestamp)
        bjsObj = ToyClass1()
        bjsObj.log = "any object"
        ToyClass1.evalAndSetValue("undefined")
    }
    
    
    // STATIC PROPERTIES
    
    func testNativeAutoProp() {
        XCTAssertNil(ToyClass1.nativeAutoProp)
        
        ToyClass1.nativeAutoProp = "1984!"
        XCTAssertEqual(ToyClass1.nativeAutoProp, "1984!")
        
        ToyClass1.nativeAutoProp = nil
        XCTAssertNil(ToyClass1.nativeAutoProp)
    }
    
    func testAnyAutoProp() {
        XCTAssertTrue(ToyClass1.anyAutoProp.jsObj.isUndefined)
        
        ToyClass1.anyAutoProp = BjsAnyObject(bjsObj)
        let subclassInstance = ToyClass1.anyAutoProp.getObject(ToyClass2.bjsFactory)!
        let superclassInstance = ToyClass1.anyAutoProp.getObject(ToyClass1.bjsFactory)!
        
        XCTAssertTrue(subclassInstance == superclassInstance)
        XCTAssertTrue(subclassInstance !== superclassInstance)
        
        XCTAssertEqual(subclassInstance.log, "any object")
    }
    
    func testBjsObjAutoProp() {
        XCTAssertNil(ToyClass1.bjsObjAutoProp)
        
        ToyClass1.bjsObjAutoProp = bjsObj
        XCTAssertEqual(ToyClass1.bjsObjAutoProp!.log, "any object")
    }
    
    func testLambdaAutoProp() {
        XCTAssertNil(ToyClass1.lambdaAutoProp)
        
        ToyClass1.lambdaAutoProp = { string in
            if string == nil {
                return "null!"
            }
            return string! + " 1984!"
        }
        XCTAssertEqual(ToyClass1.lambdaAutoProp!(nil), "null!")
        XCTAssertEqual(ToyClass1.lambdaAutoProp!("W"), "W 1984!")
        
        ToyClass1.lambdaAutoProp = nil
        XCTAssertNil(ToyClass1.lambdaAutoProp)
        
        ToyClass1.lambdaAutoProp = { string in
            return nil
        }
        XCTAssertEqual(ToyClass1.lambdaAutoProp!("x"), nil)
    }
    
    func testLambdaAutoProp_putNilToJs() {
        let nullTest = "(this.lambdaAutoProp() === null)"
        
        ToyClass1.lambdaAutoProp = { string in return "hey" }
        ToyClass1.evalAndSetValue(nullTest)
        XCTAssertEqual(ToyClass1.boolFunc(), false)
        
        ToyClass1.lambdaAutoProp = { string in return nil }
        ToyClass1.evalAndSetValue(nullTest)
        XCTAssertEqual(ToyClass1.boolFunc(), true)
    }
    
    func testNativeArrayAutoProp() {
        XCTAssertNil(ToyClass1.nativeArrayAutoProp)
        
        ToyClass1.nativeArrayAutoProp = [[["a", "b"]]]
        XCTAssertEqual(ToyClass1.nativeArrayAutoProp, [[["a", "b"]]])
        
        ToyClass1.nativeArrayAutoProp = [[[], []]]
        XCTAssertEqual(ToyClass1.nativeArrayAutoProp, [[[], []]])
        
        ToyClass1.nativeArrayAutoProp = [[], []]
        XCTAssertEqual(ToyClass1.nativeArrayAutoProp, [[], []])
        
        ToyClass1.nativeArrayAutoProp = []
        XCTAssertEqual(ToyClass1.nativeArrayAutoProp, [])
        
        ToyClass1.nativeArrayAutoProp = [nil, [nil], [[nil]], [["test", nil]]]
        XCTAssertEqual(ToyClass1.nativeArrayAutoProp, [nil, [nil], [[nil]], [["test", nil]]])
    }
    
    func testBjsObjArrayAutoProp() {
        XCTAssertNil(ToyClass1.bjsObjArrayAutoProp)
        
        ToyClass1.bjsObjArrayAutoProp = [[[bjsObj]]]
        XCTAssertEqual(ToyClass1.bjsObjArrayAutoProp, [[[bjsObj]]])
        
        ToyClass1.bjsObjArrayAutoProp = [[[], []]]
        XCTAssertEqual(ToyClass1.bjsObjArrayAutoProp, [[[], []]])
        
        ToyClass1.bjsObjArrayAutoProp = [[], []]
        XCTAssertEqual(ToyClass1.bjsObjArrayAutoProp, [[], []])
        
        ToyClass1.bjsObjArrayAutoProp = []
        XCTAssertEqual(ToyClass1.bjsObjArrayAutoProp, [])
        
        ToyClass1.bjsObjArrayAutoProp = [nil, [nil], [[nil]], [[bjsObj, nil]]]
        XCTAssertEqual(ToyClass1.bjsObjArrayAutoProp, [nil, [nil], [[nil]], [[bjsObj, nil]]])
    }
    
    func testAnyArrayAutoProp() {
        XCTAssertNil(ToyClass1.anyArrayAutoProp)
        
        let anyObj = BjsAnyObject(bjsObj.bjsObj)
        
        ToyClass1.anyArrayAutoProp = [[[ anyObj ]]]
        XCTAssertEqual(ToyClass1.anyArrayAutoProp![0]![0]![0].getObject(ToyClass1.bjsFactory)?.log, "any object")
        
        ToyClass1.anyArrayAutoProp = [[[ ]]]
        XCTAssertTrue(ToyClass1.anyArrayAutoProp![0]![0]!.isEmpty)
    }
    
    func testLambdaArrayAutoProp() {
        XCTAssertNil(ToyClass1.lambdaArrayAutoProp)
        
        let lambda1a: (_ inStr: String?) -> String? = { ($0 ?? "") + "-1a"}
        let lambda1b: (_ inStr: String?) -> String? = { ($0 ?? "") + "-2a"}
        let lambda2a: (_ inStr: String?) -> String? = { ($0 ?? "") + "-1b"}
        
        ToyClass1.lambdaArrayAutoProp = [[[ lambda1a, lambda1b ], [lambda2a, nil] ]]
        
        XCTAssertEqual(ToyClass1.lambdaArrayAutoProp![0]![0]![0]!("test"), "test-1a")
        XCTAssertEqual(ToyClass1.lambdaArrayAutoProp![0]![0]![1]!("test"), "test-2a")
        XCTAssertEqual(ToyClass1.lambdaArrayAutoProp![0]![1]![0]!("test"), "test-1b")
        XCTAssertNil(ToyClass1.lambdaArrayAutoProp![0]![1]![1])
        
        ToyClass1.lambdaArrayAutoProp = [[[ ]]]
        XCTAssertTrue(ToyClass1.lambdaArrayAutoProp![0]![0]!.isEmpty)
    }
    
    func testProp() {
        XCTAssertEqual(ToyClass1.prop, "1984!")
        
        ToyClass1.prop = "test value"
        XCTAssertEqual(ToyClass1.prop, "test value")
        
        ToyClass1.prop = nil
        XCTAssertEqual(ToyClass1.prop, "1984!")
    }
    
    
    // STATIC METHODS
    
    func testVoidFunc() {
        ToyClass1.voidFunc()
        XCTAssertEqual(ToyClass1.log, "called voidFunc")
    }
    
    func testParamsFunc() {
        let testExpectation = expectation(description: "called")
        ToyClass1.paramsFunc(true, testDate, 01.984, 01984, "1984", BjsAnyObject(bjsObj.bjsObj), bjsObj,
                             [1,2,3]) { () -> String? in
            testExpectation.fulfill()
            return "lambda return value"
        }
        XCTAssertEqual(ToyClass1.log, "called paramsFunc with params: true, 1984-12-26T00:00:00.000Z, 1.984, 1984, 1984, any object, any object, [1,2,3], lambda return value")
        wait(for: [testExpectation], timeout: 10)
    }
    
    func testParamsFunc_nil() {
        ToyClass1.paramsFunc(nil, nil, nil, nil, nil, ToyClass1.bjs.anyNull, nil, nil, nil)
        XCTAssertEqual(ToyClass1.log, "called paramsFunc with params: null, null, null, null, null, null, null, null, null")
    }
    
    func testBoolFunc() {
        XCTAssertNil(ToyClass1.boolFunc())
        XCTAssertEqual(ToyClass1.log, "called retValueFunc")
        
        ToyClass1.evalAndSetValue("null")
        XCTAssertNil(ToyClass1.boolFunc())
        
        ToyClass1.evalAndSetValue("false")
        XCTAssertEqual(ToyClass1.boolFunc(), false)
        
        ToyClass1.evalAndSetValue("true")
        XCTAssertEqual(ToyClass1.boolFunc(), true)
        
        ToyClass1.evalAndSetValue("1")
        XCTAssertEqual(ToyClass1.boolFunc(), true)
    }
    
    func testDateFunc() {
        XCTAssertNil(ToyClass1.dateFunc())
        XCTAssertEqual(ToyClass1.log, "called retValueFunc")
        
        ToyClass1.evalAndSetValue("null")
        XCTAssertNil(ToyClass1.dateFunc())
        
        ToyClass1.evalAndSetValue("new Date(\(testDateTimestamp!) * 1000)")
        XCTAssertEqual(ToyClass1.dateFunc(), testDate)
    }
    
    func testFloatFunc() {
        XCTAssertNil(ToyClass1.floatFunc())
        XCTAssertEqual(ToyClass1.log, "called retValueFunc")
        
        ToyClass1.evalAndSetValue("null")
        XCTAssertNil(ToyClass1.floatFunc())
        
        ToyClass1.evalAndSetValue(".1984")
        XCTAssertEqual(ToyClass1.floatFunc(), 0.1984)
        
        ToyClass1.evalAndSetValue("123456789.123456789")
        XCTAssertEqual(ToyClass1.floatFunc(), 123456789.123456789)
    }
    
    func testIntFunc() {
        XCTAssertNil(ToyClass1.intFunc())
        XCTAssertEqual(ToyClass1.log, "called retValueFunc")
        
        ToyClass1.evalAndSetValue("null")
        XCTAssertNil(ToyClass1.intFunc())
        
        ToyClass1.evalAndSetValue("1984")
        XCTAssertEqual(ToyClass1.intFunc(), 1984)
        
        ToyClass1.evalAndSetValue("1234567890")
        XCTAssertEqual(ToyClass1.intFunc(), 1234567890)
    }
    
    func testStringFunc() {
        XCTAssertNil(ToyClass1.stringFunc())
        XCTAssertEqual(ToyClass1.log, "called retValueFunc")
        
        ToyClass1.evalAndSetValue("null")
        XCTAssertNil(ToyClass1.stringFunc())
        
        ToyClass1.evalAndSetValue("'hello 84! 👋'")
        XCTAssertEqual(ToyClass1.stringFunc(), "hello 84! 👋")
    }
    
    func testLambdaVoidFunc() {
        let testExpectation = expectation(description: "called")
        
        let jsLambda = ToyClass1.lambdaVoidFunc {
            XCTAssertEqual(ToyClass1.log, "calling lambda")
            testExpectation.fulfill()
        }
        XCTAssertEqual(ToyClass1.log, "called lambdaVoidFunc")
        jsLambda!()
        wait(for: [testExpectation], timeout: 10)
        
        let nilLambda = ToyClass1.lambdaVoidFunc(nil)
        XCTAssertNil(nilLambda)
    }
    
    func testLambdaVoidFunc_nil() {
        let nilLambda = ToyClass1.lambdaVoidFunc(nil)
        XCTAssertNil(nilLambda)
    }
    
    func testLambdaWithParamsFunc() {
        let testExpectation = expectation(description: "called")
        ToyClass1.lambdaWithParamsFunc { (int, nullStr, any, obj) in
            XCTAssertEqual(ToyClass1.log, "called lambdaWithParamsFunc")
            XCTAssertEqual(int, 1984)
            XCTAssertNil(nullStr)
            XCTAssertEqual(any.getObject(ToyClass1.bjsFactory)?.log, "hello 84")
            XCTAssertEqual(obj?.log, "hello 84")
            testExpectation.fulfill()
            return "1984!"
        }
        XCTAssertEqual(ToyClass1.log, "called lambda with result: 1984!")
        wait(for: [testExpectation], timeout: 10)
    }
    
    func testReturningLambdaWithParamsFunc() {
        let lambda = ToyClass1.returningLambdaWithParamsFunc()
        XCTAssertEqual(ToyClass1.log, "called returningLambdaWithParamsFunc")
        let lambdaRetValue = lambda!(1984, BjsAnyObject(bjsObj.bjsObj), bjsObj, [1,2,3])
        XCTAssertEqual(ToyClass1.log, "called returned lambda with params: 1984, any object, any object, [1,2,3]")
        XCTAssertEqual(lambdaRetValue, "lambda returning value")
    }
    
    func testReturningLambdaWithParamsFunc_nil() {
        let lambda = ToyClass1.returningLambdaWithParamsFunc()
        XCTAssertEqual(ToyClass1.log, "called returningLambdaWithParamsFunc")
        let lambdaRetValue = lambda!(nil, ToyClass1.bjs.anyNull, nil, nil)
        XCTAssertEqual(ToyClass1.log, "called returned lambda with params: null, null, null, null")
        XCTAssertEqual(lambdaRetValue, "lambda returning value")
    }
}
