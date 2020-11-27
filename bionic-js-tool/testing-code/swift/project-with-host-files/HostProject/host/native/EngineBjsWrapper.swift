import JavaScriptCore
import Bjs

class EngineBjsWrapper: BaseEngineBjsWrapper {
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return super.bjsExportFunctions(nativeExports)
            .exportFunction("bjsGet_fuelType", bjsGet_fuelType())
    }
    
    override class func bjsBind(_ nativeExports: BjsNativeExports) {
        _ = nativeExports.exportBindFunction({
            bjs.bindNative(bjs.getBound($1, Engine.self) ?? Engine(bjs.getObj($1, FuelType.bjsFactory)), $0)
        } as @convention(block) (JSValue, JSValue) -> Void)
    }
    
    private class func bjsGet_fuelType() -> @convention(block) (JSValue) -> JSValue {
        return {
            return bjs.putObj(bjs.getWrapped($0, Engine.self)!.fuelType)
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "Engine")
    override class var bjsLocator: BjsLocator { _bjsLocator }
}

/* Engine class scaffold:

import Bjs

class Engine: BaseEngine {
    
    init(_ fuelType: FuelType?) {
        
    }
    
    var fuelType:FuelType? {
        get {
            
        }
    }
}

*/