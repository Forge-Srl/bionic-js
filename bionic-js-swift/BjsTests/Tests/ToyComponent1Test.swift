import XCTest
import JavaScriptCore

class ToyComponent1Test: XCTestCase {

    var testExpectation: XCTestExpectation!
    let objectsCount = 100
    
    override func setUp() {
        super.setUp()        
    }
    
    func testWrapped_getSum() {
        
        let wrapped = ToyComponent1("1", "2", 0)
        XCTAssertEqual(wrapped.getSum(3), 6)
    }
    
    func testWrapped_getToySum() {
        
        let wrapped1 = ToyComponent1("1", "2", 0)
        let wrapped2 = ToyComponent1("3", "4", 0)
        XCTAssertEqual(wrapped2.getToySum(wrapped1), 10)
    }
    
    func testFromJs_sameInstance() {
        
        let toy = ToyComponent1("1", "2", 0)
        UserOfToyComponent1.lastToy = toy
        XCTAssertEqual(UserOfToyComponent1.lastToy, toy)
    }
    
    func testDeallocation_referenceOnlyInJs() {
        
        ToyComponent1.testId = 1
        allocationTestBegin()
        for _ in 1...objectsCount {
            XCTAssertEqual(UserOfToyComponent1.add(1, 2, 3), 6)
            allocationInvokeGc()
        }
        allocationTestEnd()
    }
    
    func testDeallocation_referenceFromJsToWrapped() {
        
        ToyComponent1.testId = 2
        allocationTestBegin()
        for _ in 1...objectsCount {
            _ = UserOfToyComponent1.getToy(1, 2)
            UserOfToyComponent1.lastToy = nil
            allocationInvokeGc()
        }
        allocationTestEnd()
    }
    
    func testDeallocation_referenceFromWrappedToJs() {
        
        ToyComponent1.testId = 3
        allocationTestBegin()
        for _ in 1...objectsCount / 2 {
            let toy1 = ToyComponent1("1", "2", 3)
            let toy2 = ToyComponent1("3", "4", 3)
            XCTAssertEqual(UserOfToyComponent1.getSum(toy1, toy2), 10)
            XCTAssertEqual(UserOfToyComponent1.getSum(toy2, toy1), 10)
            allocationInvokeGc()
        }
        allocationTestEnd()
    }
        
    func allocationTestBegin() {
        Bjs.clear("TestProject")
        ToyComponent1.deallocCounter = 0
        testExpectation = expectation(description: "all objects deallocated")
    }
    
    func allocationInvokeGc() {
        JSGarbageCollect(ToyComponent1BjsWrapper.bjs.context.jsContext.jsGlobalContextRef)
    }
    
    func allocationTestEnd() {
        DispatchQueue.global().async {
            // At least 90% of allocated objects should be deallocated
            while ToyComponent1.deallocCounter < (self.objectsCount / 10) * 9 {
                sleep(1)
            }
            self.testExpectation.fulfill()
        }
        wait(for: [testExpectation], timeout: 100)
    }
}
