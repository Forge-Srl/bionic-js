import JavaScriptCore
import Bjs

class ToyComponent1: BjsExport {
    
    static var deallocCounter: Int = 0
    static var testId: Int?
    var testId: Int?
    
    var number1String, number2String: String?
    
    class var pi: Double? {
        get { return Double.pi }
    }
    
    class func sum(_ number1: Int?, _ number2: Int?) -> Int? {
        return number1! + number2!
    }
    
    init(_ number1: String?, _ number2: String?, _ testId: Int?) {
        self.number1String = number1
        self.number2String = number2
        self.testId = testId
    }
    
    var number1: Int? {
        get { return Int(number1String!) }
        set { number1String = String(newValue!) }
    }
    
    var number2: Int? {
        get { return Int(number2String!) }
        set { number2String = String(newValue!) }
    }
    
    func getSum(_ offset: Int?) -> Int? {
        return offset! + Int(number1String!)! + Int(number2String!)!
    }
    
    func getToySum(_ toyComponent1: ToyComponent1?) -> Int? {
        return getSum(0)! + toyComponent1!.getSum(0)!
    }
    
    deinit {
        if testId == ToyComponent1.testId {
            ToyComponent1.deallocCounter += 1
            print("**** dealloc \(ToyComponent1.deallocCounter)")
        }
    }
}
