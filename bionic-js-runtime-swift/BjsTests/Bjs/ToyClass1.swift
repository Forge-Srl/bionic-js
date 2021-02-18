import JavaScriptCore
import Bjs

class ToyClass1: BjsObject {
    
    // CONSTRUCTOR
    
    convenience init() {
        self.init(ToyClass1.bjsClass, [])
    }
    
    
    // STATIC PROPERTIES
    
    class var nativeAutoProp: String? {
        get { return bjs.getString(bjs.getProperty(self.bjsClass, "nativeAutoProp")) }
        set { bjs.setProperty(self.bjsClass, "nativeAutoProp", newValue)}
    }
    
    class var anyAutoProp: BjsAnyObject {
        get { return bjs.getAny(bjs.getProperty(self.bjsClass, "anyAutoProp")) }
        set { bjs.setProperty(self.bjsClass, "anyAutoProp", newValue.jsObj)}
    }
    
    class var bjsObjAutoProp: ToyClass1? {
        get { return bjs.getObj(bjs.getProperty(self.bjsClass, "bjsObjAutoProp"), ToyClass1.bjsFactory) }
        set { bjs.setProperty(self.bjsClass, "bjsObjAutoProp", bjs.putObj(newValue))}
    }
    
    class var lambdaAutoProp: ((_ strIn: String?) -> String?)? {
        get {
            let __jsFunc = bjs.getProperty(self.bjsClass, "lambdaAutoProp")
            return bjs.getFunc(__jsFunc) {
                return bjs.getString(bjs.funcCall(__jsFunc, bjs.putPrimitive($0)))
            }
        }
        set {
            let __func: @convention(block) (JSValue) -> JSValue = { string in
                return bjs.putPrimitive(newValue!(bjs.getString(string)))
            }
            bjs.setProperty(self.bjsClass, "lambdaAutoProp", bjs.putFunc(newValue, __func))
        }
    }
    
    class var nativeArrayAutoProp: [[[String?]?]?]? {
        get {
            return bjs.getArray(bjs.getProperty(self.bjsClass, "nativeArrayAutoProp"),
                                 { bjs.getArray($0, { bjs.getArray($0, { bjs.getString($0) }) }) })
        }
        set {
            bjs.setProperty(self.bjsClass, "nativeArrayAutoProp", newValue)
        }
    }
    
    class var bjsObjArrayAutoProp: [[[ToyClass1?]?]?]? {
        get {
            return bjs.getArray(bjs.getProperty(self.bjsClass, "bjsObjArrayAutoProp"),
                                 { bjs.getArray($0, { bjs.getArray($0, { bjs.getObj($0, ToyClass1.bjsFactory) }) }) })
        }
        set {
            bjs.setProperty(self.bjsClass, "bjsObjArrayAutoProp",
                             bjs.putArray(newValue, { bjs.putArray($0, { bjs.putArray($0, { bjs.putObj($0) }) }) }))
        }
    }
    
    class var anyArrayAutoProp: [[[BjsAnyObject]?]?]? {
        get {
            return bjs.getArray(bjs.getProperty(self.bjsClass, "anyArrayAutoProp"),
                                 { bjs.getArray($0, { bjs.getArray($0, { bjs.getAny($0) }) }) })
        }
        set {
            bjs.setProperty(self.bjsClass, "anyArrayAutoProp",
                             bjs.putArray(newValue, { bjs.putArray($0, { bjs.putArray($0, { $0.jsObj }) }) }))
        }
    }
    
    class var lambdaArrayAutoProp: [[[((_ strIn: String?) -> String?)?]?]?]? {
        get {
            return bjs.getArray(bjs.getProperty(self.bjsClass, "lambdaArrayAutoProp"),
                                 { bjs.getArray($0, { bjs.getArray($0, { __jsFunc in
                                    return bjs.getFunc(__jsFunc) { string in
                                        return bjs.getString(bjs.funcCall(__jsFunc, string))
                                    }
                                 }) }) }
            )
        }
        set {
            bjs.setProperty(self.bjsClass, "lambdaArrayAutoProp",
                             bjs.putArray(newValue, { bjs.putArray($0, { bjs.putArray($0, { __func in
                                let __jsFunc: @convention(block) (JSValue) -> JSValue = { string in
                                    return bjs.putPrimitive(__func!(bjs.getString(string)))
                                }
                                return bjs.putFunc(__func, __jsFunc)
                             }) }) })
            )
        }
    }
    
    class var prop: String? {
        get { return bjs.getString(bjs.getProperty(self.bjsClass, "prop")) }
        set { bjs.setProperty(self.bjsClass, "prop", newValue)}
    }
    
    
    // STATIC METHODS
    
    class func voidFunc() {
        _ = bjs.call(self.bjsClass, "voidFunc")
    }
    
    class func paramsFunc(_ bool: Bool?, _ date: Date?, _ float: Double?, _ int: Int?,
                          _ string: String?, _ any: BjsAnyObject, _ bjsObj: ToyClass1?,
                          _ array: [Int?]?, _ lambda: (() -> String?)?) {
        let __func: @convention(block) () -> String? = {
            return lambda!()
        }
        _ = bjs.call(self.bjsClass, "paramsFunc", bool, date, float, int, string, any.jsObj,
                      bjs.putObj(bjsObj), bjs.putArray(array, { bjs.putPrimitive($0) }),
                      bjs.putFunc(lambda, __func))
    }
    
    class func boolFunc() -> Bool? {
        return bjs.getBool(bjs.call(self.bjsClass, "retValueFunc"))
    }
    
    class func dateFunc() -> Date? {
        return bjs.getDate(bjs.call(self.bjsClass, "retValueFunc"))
    }
    
    class func floatFunc() -> Double? {
        return bjs.getFloat(bjs.call(self.bjsClass, "retValueFunc"))
    }
    
    class func intFunc() -> Int? {
        return bjs.getInt(bjs.call(self.bjsClass, "retValueFunc"))
    }
    
    class func stringFunc() -> String? {
        return bjs.getString(bjs.call(self.bjsClass, "retValueFunc"))
    }
    
    class func lambdaVoidFunc(_ lambda: (() -> Void)?) -> (() -> Void)? {
        let __func: @convention(block) () -> Void = {
            lambda!()
        }
        let __jsFunc = bjs.call(self.bjsClass, "lambdaVoidFunc", bjs.putFunc(lambda, __func))
        return bjs.getFunc(__jsFunc) {
            _ = bjs.funcCall(__jsFunc)
        }
    }
    
    class func lambdaWithParamsFunc(_ lambda: ((_ int: Int?, _ nullStr: String?, _ any: BjsAnyObject, _ obj: ToyClass1?) -> String?)?) {
        let __func: @convention(block) (JSValue, JSValue, JSValue, JSValue) -> JSValue = { int, nullStr, any, obj in
            return bjs.putPrimitive(lambda!(bjs.getInt(int), bjs.getString(nullStr), bjs.getAny(any), bjs.getObj(obj, ToyClass1.bjsFactory)))
        }
        _ = bjs.call(self.bjsClass, "lambdaWithParamsFunc", bjs.putFunc(lambda, __func))
    }
    
    class func returningLambdaWithParamsFunc() ->
    ((_ int: Int?, _ any: BjsAnyObject, _ obj: ToyClass1?, _ array: [Int?]?) -> String?)? {
        let __jsFunc = bjs.call(self.bjsClass, "returningLambdaWithParamsFunc")
        return bjs.getFunc(__jsFunc) { int, any, obj, array in
            return bjs.getString(bjs.funcCall(__jsFunc, int, any.jsObj, bjs.putObj(obj),
                                                bjs.putArray(array, { bjs.putPrimitive($0) })))
        }
    }
    
    
    // BJS HELPERS
    
    private static var _bjsLocator = BjsLocator("TestProject", "ToyClass1")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    class func bjsFactory(_ jsObject: JSValue) -> ToyClass1 { ToyClass1(jsObject)}
    
    
    // TESTING HELPERS
    
    class var log: String {
        get { return bjs.getProperty(self.bjsClass, "log").toString() }
        set { bjs.setProperty(self.bjsClass, "log", newValue) }
    }
    
    var log: String {
        get { return bjsGetProperty("log").toString() }
        set { bjsSetProperty("log", newValue) }
    }
    
    class func evalAndSetValue(_ jsToEval: String) {
        _ = bjs.call(self.bjsClass, "setValue", jsToEval)
    }
    
    func evalAndSetValue(_ jsToEval: String) {
        _ = bjsCall("setValue", jsToEval)
    }
}
