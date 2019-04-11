/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit
import JavaScriptCore

public class BjsNativeExports {
    
    let exportsObject: JSValue
    
    init(_ context: JSContext) {
        self.exportsObject = JSValue.init(newObjectIn: context)
    }
    
    public func exportBindFunction<T>(_ functionBlock: T) -> BjsNativeExports {
        return exportFunction("bjsBind", functionBlock)
    }
    
    public func exportFunction<T>(_ name: String, _ functionBlock: T) -> BjsNativeExports {
        exportsObject.setObject(unsafeBitCast(functionBlock, to: AnyObject.self), forKeyedSubscript: name as NSString)
        return self
    }
}
