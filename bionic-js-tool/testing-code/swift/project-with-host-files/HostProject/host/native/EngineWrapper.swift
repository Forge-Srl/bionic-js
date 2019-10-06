import JavaScriptCore
import Bjs

class EngineWrapper: BjsNativeWrapper {
    
    override class var name: String { return "Engine" }
    override class var wrapperPath: String { return "native/Engine.js" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {
        _ = nativeExports
            .exportBindFunction(bjsBind())
            .exportFunction("bjsGet_fuelType", bjsGet_fuelType())
            .exportFunction("bjs_powerOn", bjs_powerOn())
            .exportFunction("bjs_powerOff", bjs_powerOff())
            .exportFunction("bjs_watch", bjs_watch())
    }
    
    // default constructor
    class func bjsBind() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            Bjs.get.bindNative(Bjs.get.getBound($1, Engine.self) ?? Engine(), $0)
        }
    }
    
    // var fuelType: String? { get { } }
    class func bjsGet_fuelType() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Engine.self)!.fuelType)
        }
    }
    
    // func powerOn() { }
    class func bjs_powerOn() -> @convention(block) (JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, Engine.self)!.powerOn()
        }
    }
    
    // func powerOff() { }
    class func bjs_powerOff() -> @convention(block) (JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, Engine.self)!.powerOff()
        }
    }
    
    // func watch(_ callback: (() -> String?)?) { }
    class func bjs_watch() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            let jsFunc_bjs0 = $1
            _ = Bjs.get.getWrapped($0, Engine.self)!.watch(Bjs.get.getFunc(jsFunc_bjs0) {
                return Bjs.get.getString(Bjs.get.funcCall(jsFunc_bjs0))
            })
        }
    }
}
