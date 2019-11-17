import JavaScriptCore
import Bjs

class EngineWrapper: BjsNativeWrapper {
    
    override class var name: String { return "Engine" }
    override class var wrapperPath: String { return "/native/Engine" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return nativeExports
            .exportFunction("bjsGet_fuelType", bjsGet_fuelType())
            .exportFunction("bjs_powerOn", bjs_powerOn())
            .exportFunction("bjs_powerOff", bjs_powerOff())
            .exportFunction("bjs_watch", bjs_watch())
    }
    
    override class func bjsBind(_ nativeExports: BjsNativeExports) {
        _ = nativeExports.exportBindFunction({
            Bjs.get.bindNative(Bjs.get.getBound($1, Engine.self), $0)
        } as @convention(block) (JSValue, JSValue) -> Void)
    }
    
    private class func bjsGet_fuelType() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, Engine.self)!.fuelType)
        }
    }
    
    private class func bjs_powerOn() -> @convention(block) (JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, Engine.self)!.powerOn()
        }
    }
    
    private class func bjs_powerOff() -> @convention(block) (JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, Engine.self)!.powerOff()
        }
    }
    
    private class func bjs_watch() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            let jsFunc_bjs0 = $1
            _ = Bjs.get.getWrapped($0, Engine.self)!.watch(Bjs.get.getFunc(jsFunc_bjs0) {
                return Bjs.get.getString(Bjs.get.funcCall(jsFunc_bjs0))
            })
        }
    }
}

/* Engine class scaffold:

import Bjs

class Engine {
    
    var fuelType:String? {
        get {
            
        }
    }
    
    func powerOn() {
        
    }
    
    func powerOff() {
        
    }
    
    func watch(_ callback: (() -> String?)?) {
        
    }
}

*/