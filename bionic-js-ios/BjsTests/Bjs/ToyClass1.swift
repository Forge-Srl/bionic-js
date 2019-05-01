import JavaScriptCore
import Bjs

class ToyClass1: BjsObject {
    
    // CONSTRUCTOR
    
    convenience init() {
        self.init(ToyClass1.bjsClass, [])
    }
    
    
    // STATIC PROPERTIES
    
    class var nativeAutoProp: String? {
        get { return Bjs.get.getString(Bjs.get.getProperty(self.bjsClass, "nativeAutoProp")) }
        set { Bjs.get.setProperty(self.bjsClass, "nativeAutoProp", newValue)}
    }
    
    class var anyAutoProp: BjsAnyObject {
        get { return Bjs.get.getAny(Bjs.get.getProperty(self.bjsClass, "anyAutoProp")) }
        set { Bjs.get.setProperty(self.bjsClass, "anyAutoProp", newValue.jsObj)}
    }
    
    class var bjsObjAutoProp: ToyClass1? {
        get { return Bjs.get.getObj(Bjs.get.getProperty(self.bjsClass, "bjsObjAutoProp"), ToyClass1.bjsFactory) }
        set { Bjs.get.setProperty(self.bjsClass, "bjsObjAutoProp", Bjs.get.putObj(newValue))}
    }
    
    class var lambdaAutoProp: ((_ strIn: String?) -> String?)? {
        get {
            let __jsFunc = Bjs.get.getProperty(self.bjsClass, "lambdaAutoProp")
            return Bjs.get.getFunc(__jsFunc) {
                return Bjs.get.getString(Bjs.get.funcCall(__jsFunc, Bjs.get.putPrimitive($0)))
            }
        }
        set {
            let __func: @convention(block) (JSValue) -> JSValue = { string in
                return Bjs.get.putPrimitive(newValue!(Bjs.get.getString(string)))
            }
            Bjs.get.setProperty(self.bjsClass, "lambdaAutoProp", Bjs.get.putFunc(newValue, __func))
        }
    }
    
    class var nativeArrayAutoProp: [[[String?]?]?]? {
        get {
            return Bjs.get.getArray(Bjs.get.getProperty(self.bjsClass, "nativeArrayAutoProp"),
                { Bjs.get.getArray($0, { Bjs.get.getArray($0, { Bjs.get.getString($0) }) }) })
        }
        set {
            Bjs.get.setProperty(self.bjsClass, "nativeArrayAutoProp", newValue)
        }
    }
    
    class var bjsObjArrayAutoProp: [[[ToyClass1?]?]?]? {
        get {
            return Bjs.get.getArray(Bjs.get.getProperty(self.bjsClass, "bjsObjArrayAutoProp"),
                        { Bjs.get.getArray($0, { Bjs.get.getArray($0, { Bjs.get.getObj($0, ToyClass1.bjsFactory) }) }) })
        }
        set {
            Bjs.get.setProperty(self.bjsClass, "bjsObjArrayAutoProp",
                Bjs.get.putArray(newValue, { Bjs.get.putArray($0, { Bjs.get.putArray($0, { Bjs.get.putObj($0) }) }) }))
        }
    }
    
    class var anyArrayAutoProp: [[[BjsAnyObject]?]?]? {
        get {
            return Bjs.get.getArray(Bjs.get.getProperty(self.bjsClass, "anyArrayAutoProp"),
                                    { Bjs.get.getArray($0, { Bjs.get.getArray($0, { Bjs.get.getAny($0) }) }) })
        }
        set {
            Bjs.get.setProperty(self.bjsClass, "anyArrayAutoProp",
                Bjs.get.putArray(newValue, { Bjs.get.putArray($0, { Bjs.get.putArray($0, { $0.jsObj }) }) }))
        }
    }
    
    class var lambdaArrayAutoProp: [[[((_ strIn: String?) -> String?)?]?]?]? {
        get {
            return Bjs.get.getArray(Bjs.get.getProperty(self.bjsClass, "lambdaArrayAutoProp"),
                                    { Bjs.get.getArray($0, { Bjs.get.getArray($0, { __jsFunc in
                                        return Bjs.get.getFunc(__jsFunc) { string in
                                            return Bjs.get.getString(Bjs.get.funcCall(__jsFunc, string))
                                        }
                                    }) }) }
            )
        }
        set {
            Bjs.get.setProperty(self.bjsClass, "lambdaArrayAutoProp",
                                Bjs.get.putArray(newValue, { Bjs.get.putArray($0, { Bjs.get.putArray($0, { __func in
                                    let __jsFunc: @convention(block) (JSValue) -> JSValue = { string in
                                        return Bjs.get.putPrimitive(__func!(Bjs.get.getString(string)))
                                    }
                                    return Bjs.get.putFunc(__func, __jsFunc)
                                }) }) })
            )
        }
    }
    
    class var prop: String? {
        get { return Bjs.get.getString(Bjs.get.getProperty(self.bjsClass, "prop")) }
        set { Bjs.get.setProperty(self.bjsClass, "prop", newValue)}
    }
    
    
    // STATIC METHODS
    
    class func voidFunc() {
        _ = Bjs.get.call(self.bjsClass, "voidFunc")
    }
    
    class func paramsFunc(_ bool: Bool?, _ date: Date?, _ float: Double?, _ int: Int?,
                          _ string: String?, _ any: BjsAnyObject, _ bjsObj: ToyClass1?,
                          _ array: [Int?]?, _ lambda: (() -> String?)?) {
        let __func: @convention(block) () -> String? = {
            return lambda!()
        }
        _ = Bjs.get.call(self.bjsClass, "paramsFunc", bool, date, float, int, string, any.jsObj,
                         Bjs.get.putObj(bjsObj), Bjs.get.putArray(array, { Bjs.get.putPrimitive($0) }),
                         Bjs.get.putFunc(lambda, __func))
    }
    
    class func boolFunc() -> Bool? {
        return Bjs.get.getBool(Bjs.get.call(self.bjsClass, "retValueFunc"))
    }
    
    class func dateFunc() -> Date? {
        return Bjs.get.getDate(Bjs.get.call(self.bjsClass, "retValueFunc"))
    }
    
    class func floatFunc() -> Double? {
        return Bjs.get.getFloat(Bjs.get.call(self.bjsClass, "retValueFunc"))
    }
    
    class func intFunc() -> Int? {
        return Bjs.get.getInt(Bjs.get.call(self.bjsClass, "retValueFunc"))
    }
    
    class func stringFunc() -> String? {
        return Bjs.get.getString(Bjs.get.call(self.bjsClass, "retValueFunc"))
    }
    
    class func lambdaVoidFunc(_ lambda: (() -> Void)?) -> (() -> Void)? {
        let __func: @convention(block) () -> Void = {
            lambda!()
        }
        let __jsFunc = Bjs.get.call(self.bjsClass, "lambdaVoidFunc", Bjs.get.putFunc(lambda, __func))
        return Bjs.get.getFunc(__jsFunc) {
            _ = Bjs.get.funcCall(__jsFunc)
        }
    }
    
    class func lambdaWithParamsFunc(_ lambda: ((_ int: Int?, _ nullStr: String?, _ any: BjsAnyObject, _ obj: ToyClass1?) -> String?)?) {
        let __func: @convention(block) (JSValue, JSValue, JSValue, JSValue) -> JSValue = { int, nullStr, any, obj in
            return Bjs.get.putPrimitive(lambda!(Bjs.get.getInt(int), Bjs.get.getString(nullStr), Bjs.get.getAny(any), Bjs.get.getObj(obj, ToyClass1.bjsFactory)))
        }
        _ = Bjs.get.call(self.bjsClass, "lambdaWithParamsFunc", Bjs.get.putFunc(lambda, __func))
    }
    
    class func returningLambdaWithParamsFunc() ->
        ((_ int: Int?, _ any: BjsAnyObject, _ obj: ToyClass1?, _ array: [Int?]?) -> String?)? {
            let __jsFunc = Bjs.get.call(self.bjsClass, "returningLambdaWithParamsFunc")
            return Bjs.get.getFunc(__jsFunc) { int, any, obj, array in
                return Bjs.get.getString(Bjs.get.funcCall(__jsFunc, int, any.jsObj, Bjs.get.putObj(obj),
                            Bjs.get.putArray(array, { Bjs.get.putPrimitive($0) })))
            }
    }
    
    
    // BJS HELPERS
    
    override class var bjsModulePath: String {
        return "/_bundle_/test/src/ToyClass1"
    }
    
    class func bjsFactory(_ jsObject: JSValue) -> ToyClass1 {
        return ToyClass1(jsObject)
    }
    
    
    // TESTING HELPERS
    
    class var log: String {
        get { return Bjs.get.getProperty(self.bjsClass, "log").toString() }
        set { Bjs.get.setProperty(self.bjsClass, "log", newValue) }
    }
    
    var log: String {
        get { return bjsGetProperty("log").toString() }
        set { bjsSetProperty("log", newValue) }
    }
    
    class func evalAndSetValue(_ jsToEval: String) {
        _ = Bjs.get.call(self.bjsClass, "setValue", jsToEval)
    }
    
    func evalAndSetValue(_ jsToEval: String) {
        _ = bjsCall("setValue", jsToEval)
    }
}
