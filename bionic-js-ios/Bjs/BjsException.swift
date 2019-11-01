/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit
import JavaScriptCore

class BjsException {
    
    private var jsException: JSValue?
    
    init (_ jsException: JSValue?) {
        
        self.jsException = jsException
    }
    
    var description: String {
        
        if self.notLocalizable {
            return "undefined exception thrown in js code";
        }
        
        let description = jsException!.description
        let stack =  jsException!.objectForKeyedSubscript("stack").toString()!
        return "\(description)\n\n"
            + "***[js exception stack]***************\n" + stack + "\n"
            + "**************************************\n"
    }
    
    var notLocalizable: Bool {
        
        return jsException == nil || Bjs.isNullOrUndefined(jsException!) || !jsException!.hasProperty("stack")
    }
}
