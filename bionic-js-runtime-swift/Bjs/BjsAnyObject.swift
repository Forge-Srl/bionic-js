import JavaScriptCore

public class BjsAnyObject {
    
    public let jsObj: JSValue
    
    public init(_ jsObj: JSValue) {
        self.jsObj = jsObj
    }
    
    public init(_ bjsObj: BjsObject) {
        self.jsObj = bjsObj.bjsObj
    }
    
    public func getObject<T : BjsObject>(_ bjsFactory: Bjs.Factory<T>) -> T? {
        return T.self.bjs.getObj(jsObj, bjsFactory)
    }
}
