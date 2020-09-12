import JavaScriptCore
import Bjs

class UserOfToyComponent1: BjsObject {
    
    static var lastToy: ToyComponent1? {
        get {
            return Bjs.get.getWrapped(Bjs.get.getProperty(UserOfToyComponent1.bjsClass, "lastToy"), ToyComponent1.self)
        }
        set {
            Bjs.get.setProperty(UserOfToyComponent1.bjsClass, "lastToy", Bjs.get.putWrapped(newValue, ToyComponent1Wrapper.self))
        }
    }
    
    class func add(_ offset: Int?, _ int1: Int?, _ int2: Int?) -> Int? {
        return Bjs.get.getInt(Bjs.get.call(UserOfToyComponent1.bjsClass, "add", Bjs.get.putPrimitive(offset),
                                           Bjs.get.putPrimitive(int1), Bjs.get.putPrimitive(int2)))
    }
    
    class func getToy(_ int1: Int?, _ int2: Int?) -> ToyComponent1? {
        return Bjs.get.getWrapped(Bjs.get.call(UserOfToyComponent1.bjsClass, "getToy", Bjs.get.putPrimitive(int1),
                                              Bjs.get.putPrimitive(int2)), ToyComponent1.self)
    }
    
    class func getSum(_ toy1: ToyComponent1?, _ toy2: ToyComponent1?) -> Int? {
        return Bjs.get.getInt(Bjs.get.call(UserOfToyComponent1.bjsClass, "getSum",
                                           Bjs.get.putWrapped(toy1, ToyComponent1Wrapper.self),
                                           Bjs.get.putWrapped(toy2, ToyComponent1Wrapper.self)))
    }
    
    class func isLastToy(_ toy: ToyComponent1?) -> Bool? {
        return Bjs.get.getBool(Bjs.get.call(UserOfToyComponent1.bjsClass, "isLastToy",
                                           Bjs.get.putWrapped(toy, ToyComponent1Wrapper.self)))
    }
    
    
    override class var bjsModulePath: String {
        return "/src/UserOfToyComponent1"
    }
    
    class func bjsFactory(_ jsObject: JSValue) -> UserOfToyComponent1 {
        return UserOfToyComponent1(jsObject)
    }
}
