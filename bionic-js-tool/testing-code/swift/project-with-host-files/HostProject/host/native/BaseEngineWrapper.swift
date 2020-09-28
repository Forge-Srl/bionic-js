import JavaScriptCore
import Bjs

class BaseEngineWrapper: BjsNativeWrapper {
    
    override class var name: String { return "BaseEngine" }
    override class var wrapperPath: String { return "/native/BaseEngine" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return nativeExports
            .exportFunction("bjs_powerOn", bjs_powerOn())
            .exportFunction("bjs_powerOff", bjs_powerOff())
            .exportFunction("bjs_watch", bjs_watch())
    }
    
    override class func bjsBind(_ nativeExports: BjsNativeExports) {
        _ = nativeExports.exportBindFunction({
            Bjs.get.bindNative(Bjs.get.getBound($1, BaseEngine.self), $0)
        } as @convention(block) (JSValue, JSValue) -> Void)
    }
    
    private class func bjs_powerOn() -> @convention(block) (JSValue) -> Void {
        return {
            Bjs.get.getWrapped($0, BaseEngine.self)!.powerOn()
        }
    }
    
    private class func bjs_powerOff() -> @convention(block) (JSValue) -> Void {
        return {
            Bjs.get.getWrapped($0, BaseEngine.self)!.powerOff()
        }
    }
    
    private class func bjs_watch() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            let jsFunc_bjs0 = $1
            Bjs.get.getWrapped($0, BaseEngine.self)!.watch(Bjs.get.getFunc(jsFunc_bjs0) {
                return Bjs.get.getString(Bjs.get.funcCall(jsFunc_bjs0))
            })
        }
    }
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