import JavaScriptCore
import Bjs

class ToyNative1User: BjsClass {
    
    class func add(_ offset: Int?, _ int1: Int?, _ int2: Int?) -> Int? {
        return Bjs.get.getInt(Bjs.get.call(ToyNative1User.bjsClass, "add", Bjs.get.putPrimitive(offset),
                                           Bjs.get.putPrimitive(int1), Bjs.get.putPrimitive(int2)))
    }
    
    class func getToy(_ int1: Int?, _ int2: Int?) -> ToyWrapped1? {
        return Bjs.get.getWrapped(Bjs.get.call(ToyNative1User.bjsClass, "getToy", Bjs.get.putPrimitive(int1),
                                              Bjs.get.putPrimitive(int2)), ToyWrapped1.self)
    }
    
    class func getSum(_ toy1: ToyWrapped1?, _ toy2: ToyWrapped1?) -> Int? {
        return Bjs.get.getInt(Bjs.get.call(ToyNative1User.bjsClass, "getSum",
                                           Bjs.get.putWrapped(toy1, ToyWrapped1Wrapper.self),
                                           Bjs.get.putWrapped(toy2, ToyWrapped1Wrapper.self)))
    }
    
    
    override class var bjsModulePath: String {
        return "/_bundle_/test/src/ToyNative1User"
    }
    
    class func bjsFactory(_ jsObject: JSValue) -> ToyNative1User {
        return ToyNative1User(jsObject)
    }
}
