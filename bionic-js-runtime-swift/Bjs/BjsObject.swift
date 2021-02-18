import JavaScriptCore

open class BjsObject : Hashable {
    
    open class var bjsLocator: BjsLocator { BjsLocator() }
    open class var bjs: Bjs { bjsLocator.get }
    private var bjs: Bjs { type(of:self).bjsLocator.get }
    
    public let bjsObj: JSValue
    
    public init(_ jsObj: JSValue) {
        bjsObj = jsObj
        bjs.createNativeObj(jsObj, self)
    }
    
    public init(_ jsClass: JSValue, _ arguments: [Any?]) {
        bjsObj = jsClass.construct(withArguments: arguments.map({$0 as Any}))
        bjs.createNativeObj(bjsObj, self)
    }
    
    public class var bjsClass: JSValue { bjs.loadModule(bjsLocator.moduleName) }
    
    
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
    
    
    public func castTo<T: BjsObject>(_ bjsFactory: Bjs.Factory<T>) -> T? {
        return bjs.getObj(self.bjsObj, bjsFactory)
    }
    
    public func hash(into hasher: inout Hasher) {
        ObjectIdentifier(self).hash(into: &hasher)
    }
    
    public static func ==(lhs: BjsObject, rhs: BjsObject) -> Bool {
        return lhs.bjsObj.isEqual(to: rhs.bjsObj)
    }
}
