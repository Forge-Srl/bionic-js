import JavaScriptCore

class BjsException {
    
    private var jsException: JSValue?
    
    init (_ jsException: JSValue?) {
        self.jsException = jsException
    }
    
    var description: String {
        if self.notLocalizable {
            return "unknown exception thrown in js code";
        }
        
        let description = jsException!.description
        let stack =  jsException!.objectForKeyedSubscript("stack").toString()!
        return "\(description)\n\n"
            + "***[ js exception stack ]***************\n"
            + stack + "\n"
            + "****************************************\n"
    }
    
    var notLocalizable: Bool {
        return jsException == nil || Bjs.isNullOrUndefined(jsException!) || !jsException!.hasProperty("stack")
    }
}
