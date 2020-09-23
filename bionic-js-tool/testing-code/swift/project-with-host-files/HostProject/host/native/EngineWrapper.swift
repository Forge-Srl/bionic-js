import JavaScriptCore
import Bjs

class EngineWrapper: BaseEngineWrapper {
    
    override class var name: String { return "Engine" }
    override class var wrapperPath: String { return "/native/Engine" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return super.bjsExportFunctions(nativeExports)
            .exportFunction("bjsGet_fuelType", bjsGet_fuelType())
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
}

/* Engine class scaffold:

import Bjs

class Engine: BaseEngine {
    
    var fuelType:String? {
        get {
            
        }
    }
}

*/