import JavaScriptCore
import Bjs

class UserOfToyComponent1: BjsObject {
    
    static var lastToy: ToyComponent1? {
        get {
            return UserOfToyComponent1.bjs.getWrapped(bjs.getProperty(UserOfToyComponent1.bjsClass, "lastToy"), ToyComponent1.self)
        }
        set {
            UserOfToyComponent1.bjs.setProperty(UserOfToyComponent1.bjsClass, "lastToy", UserOfToyComponent1.bjs.putWrapped(newValue, ToyComponent1BjsWrapper.self))
        }
    }
    
    class func add(_ offset: Int?, _ int1: Int?, _ int2: Int?) -> Int? {
        return UserOfToyComponent1.bjs.getInt(bjs.call(UserOfToyComponent1.bjsClass, "add", UserOfToyComponent1.bjs.putPrimitive(offset),
                                           UserOfToyComponent1.bjs.putPrimitive(int1), UserOfToyComponent1.bjs.putPrimitive(int2)))
    }
    
    class func getToy(_ int1: Int?, _ int2: Int?) -> ToyComponent1? {
        return UserOfToyComponent1.bjs.getWrapped(bjs.call(UserOfToyComponent1.bjsClass, "getToy", UserOfToyComponent1.bjs.putPrimitive(int1),
                                              UserOfToyComponent1.bjs.putPrimitive(int2)), ToyComponent1.self)
    }
    
    class func getSum(_ toy1: ToyComponent1?, _ toy2: ToyComponent1?) -> Int? {
        return UserOfToyComponent1.bjs.getInt(bjs.call(UserOfToyComponent1.bjsClass, "getSum",
                                           UserOfToyComponent1.bjs.putWrapped(toy1, ToyComponent1BjsWrapper.self),
                                           UserOfToyComponent1.bjs.putWrapped(toy2, ToyComponent1BjsWrapper.self)))
    }
        
    class func bjsFactory(_ jsObject: JSValue) -> UserOfToyComponent1 {
        return UserOfToyComponent1(jsObject)
    }
    
    private static var _bjsLocator = BjsLocator("TestProject", "UserOfToyComponent1")
    override class var bjsLocator: BjsLocator { _bjsLocator }
}
