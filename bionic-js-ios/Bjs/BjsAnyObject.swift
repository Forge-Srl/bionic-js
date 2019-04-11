/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import JavaScriptCore

public class BjsAnyObject {
    
    public let jsObj: JSValue
    
    public init(_ jsObj: JSValue) {
        self.jsObj = jsObj
    }
    
    public init(_ bjsObj: BjsClass) {
        self.jsObj = bjsObj.bjsObj
    }
    
    public func getObject<T : BjsClass>(_ bjsFactory: Bjs.Factory<T>) -> T? {
        return Bjs.get.getObj(jsObj, bjsFactory)
    }
}
