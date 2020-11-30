import JavaScriptCore
import Bjs

class BaseEngineBjsWrapper: BjsNativeWrapper {
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return nativeExports
            .exportFunction("bjs_powerOn", bjs_powerOn())
            .exportFunction("bjs_powerOff", bjs_powerOff())
            .exportFunction("bjs_watch", bjs_watch())
    }
    
    override class func bjsBind(_ nativeExports: BjsNativeExports) {
        _ = nativeExports.exportBindFunction({
            bjs.bindNative(bjs.getBound($1, BaseEngine.self), $0)
        } as @convention(block) (JSValue, JSValue) -> Void)
    }
    
    private class func bjs_powerOn() -> @convention(block) (JSValue) -> Void {
        return {
            bjs.getWrapped($0, BaseEngine.self)!.powerOn()
        }
    }
    
    private class func bjs_powerOff() -> @convention(block) (JSValue) -> Void {
        return {
            bjs.getWrapped($0, BaseEngine.self)!.powerOff()
        }
    }
    
    private class func bjs_watch() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            let jsFunc_bjs0 = $1
            bjs.getWrapped($0, BaseEngine.self)!.watch(bjs.getFunc(jsFunc_bjs0) {
                return bjs.getString(bjs.funcCall(jsFunc_bjs0))
            })
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "BaseEngine")
    override class var bjsLocator: BjsLocator { _bjsLocator }
}

/* BaseEngine class scaffold:

import Bjs

class BaseEngine: BjsExport {
    
    func powerOn() {
        
    }
    
    func powerOff() {
        
    }
    
    func watch(_ callback: (() -> String?)?) {
        
    }
}

*/