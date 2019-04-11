/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import JavaScriptCore

class BjsContext {
    
    public let jsContext: JSContext = JSContext()
    public var timeoutIds: NSMutableSet = NSMutableSet()
    public var lastTimeoutId: Int = 0
    
    init() {
        jsContext.exceptionHandler = { context, exception in
            
            let bjsException = BjsException(exception)
            if bjsException.notLocalizable {
                return;
            }
            self.logError(bjsException.description)
            context?.exception = exception
        }
        
        let consoleLog: @convention(block) (_ : String) -> Void = { message in self.logInfo(message) }
        let consoleError: @convention(block) (_ : String) -> Void = { message in self.logError(message) }
        let console = jsContext.objectForKeyedSubscript("console")!
        console.setObject(consoleLog, forKeyedSubscript: "log" as NSString)
        console.setObject(consoleError, forKeyedSubscript: "error" as NSString)
        
        let setTimeout: @convention(block) (_ : JSValue, _ : Int) -> Void = { function, delayInMs in
            self.lastTimeoutId += 1
            let handlerId = self.lastTimeoutId
            self.timeoutIds.add(handlerId)
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(delayInMs)) {
                if self.timeoutIds.contains(handlerId) {
                    function.call(withArguments: [])
                    self.timeoutIds.remove(handlerId)
                }
            }
        }
        jsContext.setObject(setTimeout, forKeyedSubscript: "setTimeout" as NSString)
        
        let clearTimeout: @convention(block) (_ : Int) -> Void = { timeoutId in
            if self.timeoutIds.contains(timeoutId) {
                self.timeoutIds.remove(timeoutId)
            }
        }
        jsContext.setObject(clearTimeout, forKeyedSubscript: "clearTimeout" as NSString)
    }
    
    func createJsObject(_ nativeObj: Any!) -> JSValue! {
        let jsObj = JSValue(object: nativeObj, in: jsContext)
        return jsObj
    }
    
    func createJsNull() -> JSValue! {
        return JSValue(nullIn: jsContext)
    }
    
    func createNativeExports() -> BjsNativeExports {
        return BjsNativeExports(jsContext)
    }
    
    func setJsExceptionToThrow(_ exceptionMessage: String) {
        jsContext.exception = JSValue.init(newErrorFromMessage: exceptionMessage, in: jsContext)
    }
    
    func getJsException() -> JSValue? {
        return jsContext.exception
    }
    
    func executeJs(_ code: String) -> JSValue! {
        return jsContext.evaluateScript(code)
    }
    
    func executeJs(_ code: String, _ filePath: String) -> JSValue! {
        return jsContext.evaluateScript(code, withSourceURL:URL(fileURLWithPath: filePath))
    }
    
    func logError(_ message: String) {
        print("Bjs error: \(message)")
    }
    
    func logInfo(_ message: String) {
        print("Bjs info: \(message)")
    }
    
    func getJsProp(_ obj: JSValue) -> [String] {
        let getOwnPropertyNames = obj.context.objectForKeyedSubscript("Object").objectForKeyedSubscript("getOwnPropertyNames")
        return getOwnPropertyNames?.call(withArguments: [obj]).toArray() as! [String]
    }
}
