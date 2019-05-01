import XCTest
import JavaScriptCore

class ToyComponent1Test: XCTestCase {

    var testExpectation: XCTestExpectation!
    let objectsCount = 100
    
    override func setUp() {
        super.setUp()
        
        Bjs.get.clearJsEnvironment()
        Bjs.get.customBundles.add(bundleName: "test", bundle: Bundle(for: ToyComponent1Test.self))
        Bjs.get.addNativeWrapper(ToyComponent1Wrapper.self)
    }
    
    func testWrapped_getSum() {
        
        let wrapped = ToyComponent1("1", "2")
        XCTAssertEqual(wrapped.getSum(3), 6)
    }
    
    func testWrapped_getToySum() {
        
        let wrapped1 = ToyComponent1("1", "2")
        let wrapped2 = ToyComponent1("3", "4")
        XCTAssertEqual(wrapped2.getToySum(wrapped1), 10)
    }
    
    func testDeallocation_instanceOnlyInJs() {
        
        allocationTestBegin()
        for _ in 1...objectsCount {
            XCTAssertEqual(UserOfToyComponent1.add(1, 2, 3), 6)
        }
        allocationTestEnd()
    }
    
    func testDeallocation_instanceFromJsToWrapped() {
        
        allocationTestBegin()
        for _ in 1...objectsCount {
            let toy = UserOfToyComponent1.getToy(1, 2)
            XCTAssertEqual(toy?.number1String, "1")
            XCTAssertEqual(toy?.number2String, "2")
        }
        allocationTestEnd()
    }
    
    func testDeallocation_instanceFromWrappedToJs() {
        
        allocationTestBegin()
        for _ in 1...objectsCount / 2 {
            let toy1 = ToyComponent1("1", "2")
            let toy2 = ToyComponent1("3", "4")
            XCTAssertEqual(UserOfToyComponent1.getSum(toy1, toy2), 10)
            XCTAssertEqual(UserOfToyComponent1.getSum(toy2, toy1), 10)
        }
        allocationTestEnd()
    }
    
    func allocationTestBegin() {
        ToyComponent1.deallocCounter = 0
        testExpectation = expectation(description: "all objects deallocated")
    }
    
    func allocationTestEnd() {
        //JSGarbageCollect(Bjs.get.context.jsContext.jsGlobalContextRef)
        DispatchQueue.global().async {
            // At least 90% of allocated objects should be deallocated
            while ToyComponent1.deallocCounter < (self.objectsCount / 10) * 9 {
                JSGarbageCollect(Bjs.get.context.jsContext.jsGlobalContextRef)
                sleep(1)
            }
            self.testExpectation.fulfill()
        }
        wait(for: [testExpectation], timeout: 100)
    }
}
