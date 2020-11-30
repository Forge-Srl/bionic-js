/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit
import JavaScriptCore

public class BjsNativeExports {
    static let nativeObjName = "bjsNative"
    
    let exportsObj: JSValue
    let nativeObj: JSValue
    
    init(_ context: JSContext) {
        exportsObj = JSValue.init(newObjectIn: context)
        nativeObj = JSValue.init(newObjectIn: context)
        exportsObj.setObject(nativeObj, forKeyedSubscript:BjsNativeExports.nativeObjName)
    }
    
    public func exportBindFunction<T>(_ functionBlock: T) -> BjsNativeExports {
        return exportFunction("bjsBind", functionBlock)
    }
    
    public func exportFunction<T>(_ name: String, _ functionBlock: T) -> BjsNativeExports {
        nativeObj.setObject(unsafeBitCast(functionBlock, to: AnyObject.self), forKeyedSubscript: name as NSString)
        return self
    }
}
