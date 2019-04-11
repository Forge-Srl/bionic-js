/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit
import JavaScriptCore

open class BjsClass : Hashable {
    
    open class var bjsModulePath: String { return "" }
    public let bjsObj: JSValue
    
    public init(_ jsObj: JSValue) {
        bjsObj = jsObj
        Bjs.get.createNativeObj(jsObj, self)
    }
    
    public init(_ jsClass: JSValue, _ arguments: [Any?]) {
        bjsObj = jsClass.construct(withArguments: arguments.map({$0 as Any}))
        Bjs.get.createNativeObj(bjsObj, self)
    }
    
    public class var bjsClass: JSValue {
        return Bjs.get.loadModule(bjsModulePath);
    }
    
    
    // JS FUNCTIONS CALL
    
    public func bjsCall(_ name: String, _ arguments: Any?...) -> JSValue {
        return bjsObj.invokeMethod(name, withArguments: arguments.map({$0 as Any}))
    }
    
    
    // JS PROPERTIES
    
    public func bjsGetProperty(_ name: String) -> JSValue {
        return bjsObj.objectForKeyedSubscript(name)
    }
    
    public func bjsSetProperty(_ name: String, _ value: Any?) {
        bjsObj.setObject(value, forKeyedSubscript: name as NSString)
    }
    
    
    public func castTo<T: BjsClass>(_ bjsFactory: Bjs.Factory<T>) -> T? {
        return Bjs.get.getObj(self.bjsObj, bjsFactory)
    }
    
    public func hash(into hasher: inout Hasher) {
        ObjectIdentifier(self).hash(into: &hasher)
    }
    
    public static func ==(lhs: BjsClass, rhs: BjsClass) -> Bool {
        return lhs === rhs
    }
}
