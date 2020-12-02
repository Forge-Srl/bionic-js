import JavaScriptCore

class BjsContext {
    
    public let jsContext: JSContext = JSContext()
    public let projectName: String
    public var moduleLoader: JSValue!
    public var timeoutIds: NSMutableSet = NSMutableSet()
    public var intervalIds: NSMutableSet = NSMutableSet()
    public var lastTimeoutId: Int = 0
    public var lastIntervalId: Int = 0
    var nativeWrappers = [String : BjsNativeWrapper.Type]()
    
    init(_ projectName: String) {
        self.projectName = projectName
        
        jsContext.exceptionHandler = { [weak self] context, exception in
            let bjsException = BjsException(exception)
            if bjsException.notLocalizable {
                return;
            }
            self!.logError(bjsException.description)
            context?.exception = exception
        }
        
        let consoleLog: @convention(block) (_ : String) -> Void = { [weak self] in
            self!.logInfo($0)
        }
        let consoleError: @convention(block) (_ : String) -> Void = { [weak self] in
            self!.logError($0)
        }
        let console = jsContext.objectForKeyedSubscript("console")!
        console.setObject(consoleLog, forKeyedSubscript: "log" as NSString)
        console.setObject(consoleError, forKeyedSubscript: "error" as NSString)
        
        let setTimeout: @convention(block) (_ : JSValue, _ : Int) -> Int = { [weak self] in
            let handlerId = self!.newTimeoutId()
            self!.runTimeout(handlerId, $0, $1)
            return handlerId
        }
        jsContext.setObject(setTimeout, forKeyedSubscript: "setTimeout" as NSString)
        
        let clearTimeout: @convention(block) (_ : Int) -> Void = { [weak self] in
            self!.clearTimeout($0)
            
        }
        jsContext.setObject(clearTimeout, forKeyedSubscript: "clearTimeout" as NSString)
        
        let setInterval: @convention(block) (_ : JSValue, _ : Int) -> Int = { [weak self] in
            let handlerId = self!.newIntervalId()
            self!.runInterval(handlerId, $0, $1)
            return handlerId
        }
        jsContext.setObject(setInterval, forKeyedSubscript: "setInterval" as NSString)
        
        let clearInterval: @convention(block) (_ : Int) -> Void = { [weak self] in
            self!.clearInterval($0)
        }
        jsContext.setObject(clearInterval, forKeyedSubscript: "clearInterval" as NSString)
        
        // Shim for "process" global variable used by Node.js
        let process = JSValue.init(newObjectIn: jsContext)
        process!.setObject(JSValue.init(newObjectIn: jsContext), forKeyedSubscript: "env" as NSString)
        jsContext.setObject(process, forKeyedSubscript: "process" as NSString)
        
        let bjsNativeRequire: @convention(block) (_ : String) -> JSValue = { [weak self] in
            return self!.getNativeModule($0)
        }
        jsContext.setObject(bjsNativeRequire, forKeyedSubscript: "bjsNativeRequire" as NSString)
        
        let bjsSetModuleLoader: @convention(block) (_ : JSValue) -> Void = { [weak self] in
            self!.moduleLoader = $0
        }
        jsContext.setObject(bjsSetModuleLoader, forKeyedSubscript: "bjsSetModuleLoader" as NSString)
    }
    
    func addNativeWrappers(_ nativeWrapperClass: BjsNativeWrapper.Type) {
        
        if nativeWrapperClass.bjsLocator.isInvalid {
            fatalError("invalid module locator")
        }
        
        let wrapperName = nativeWrapperClass.bjsLocator.moduleName
        if nativeWrappers[wrapperName] != nil {
            fatalError("native wrapper \"\(wrapperName)\" was already added to this Bjs context")
        }
        nativeWrappers[wrapperName] = nativeWrapperClass
    }
    
    func getModule(_ moduleName: String) -> JSValue! {
        return moduleLoader.call(withArguments: [moduleName])
    }
        
    private func getNativeModule(_ nativeModuleName: String) -> JSValue {
        return self.nativeWrappers[nativeModuleName]!.bjsGetNativeFunctions(self)!
    }
    
    private func newTimeoutId() -> Int {
        self.lastTimeoutId += 1
        let handlerId = self.lastTimeoutId
        self.timeoutIds.add(handlerId)
        return handlerId
    }
    
    private func newIntervalId() -> Int {
        self.lastIntervalId += 1
        let handlerId = self.lastIntervalId
        self.intervalIds.add(handlerId)
        return handlerId
    }
    
    private func runTimeout(_ handlerId: Int, _ function: JSValue, _ delayInMs : Int) {
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(delayInMs)) {
            if self.timeoutIds.contains(handlerId) {
                function.call(withArguments: [])
                self.timeoutIds.remove(handlerId)
            }
        }
    }
    
    private func runInterval(_ handlerId: Int, _ function: JSValue, _ delayInMs : Int) {
        Timer.scheduledTimer(withTimeInterval: Double(delayInMs) / 1000.0, repeats: true) { timer in
            if self.intervalIds.contains(handlerId) {
                function.call(withArguments: [])
            } else {
                timer.invalidate()
            }
        }.fire()
    }
    
    private func clearTimeout(_ handlerId: Int) {
        if self.timeoutIds.contains(handlerId) {
            self.timeoutIds.remove(handlerId)
        }
    }
    
    private func clearInterval(_ handlerId: Int) {
        if self.intervalIds.contains(handlerId) {
            self.intervalIds.remove(handlerId)
        }
    }
    
    func createJsObject(_ sourceObj: Any!) -> JSValue! {
        let jsObj = JSValue(object: sourceObj, in: jsContext)
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
        print("Bjs \"\(projectName)\" error: \(message)")
    }
    
    func logInfo(_ message: String) {
        print("Bjs \"\(projectName)\" info: \(message)")
    }
    
    func getJsProp(_ obj: JSValue) -> [String] {
        let getOwnPropertyNames = obj.context.objectForKeyedSubscript("Object").objectForKeyedSubscript("getOwnPropertyNames")
        return getOwnPropertyNames?.call(withArguments: [obj]).toArray() as! [String]
    }
}
