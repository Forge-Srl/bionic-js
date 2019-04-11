import Bjs

class ToyWrapped1: BjsExport {
    
    static var deallocCounter: Int = 0
    let number1, number2: String?
    
    init(_ number1: String?, _ number2: String?) {
        self.number1 = number1
        self.number2 = number2
    }
    
    func getSum(_ offset: Int?) -> Int? {
        return offset! + Int(number1!)! + Int(number2!)!
    }
    
    func getToySum(_ toy: ToyWrapped1?) -> Int? {
        return getSum(0)! + toy!.getSum(0)!
    }
    
    deinit {
        ToyWrapped1.deallocCounter += 1
        print("**** dealloc \(ToyWrapped1.deallocCounter)")
    }
}
