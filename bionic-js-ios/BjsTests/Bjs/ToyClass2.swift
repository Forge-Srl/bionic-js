import JavaScriptCore
import Bjs

class ToyClass2: ToyClass1 {
    
    // CONSTRUCTOR
    
    convenience init(_ bool: Bool?) {
        self.init(ToyClass2.bjsClass, [bool])
    }
    
    
    // INSTANCE PROPERTIES
    
    var nativeAutoProp: String? {
        get { return ToyClass2.bjs.getString(bjsGetProperty("nativeAutoProp")) }
        set { bjsSetProperty("nativeAutoProp", newValue)}
    }
    
    var anyAutoProp: BjsAnyObject {
        get { return ToyClass2.bjs.getAny(bjsGetProperty("anyAutoProp")) }
        set { bjsSetProperty("anyAutoProp", newValue.jsObj)}
    }
    
    var bjsObjAutoProp: ToyClass2? {
        get { return ToyClass2.bjs.getObj(bjsGetProperty("bjsObjAutoProp"), ToyClass2.bjsFactory) }
        set { bjsSetProperty("bjsObjAutoProp", ToyClass2.bjs.putObj(newValue))}
    }
    
    var lambdaAutoProp: ((_ strIn: String?) -> String?)? {
        get {
            let __jsFunc0 = bjsGetProperty("lambdaAutoProp")
            return ToyClass2.bjs.getFunc(__jsFunc0) {
                return ToyClass2.bjs.getString(ToyClass2.bjs.funcCall(__jsFunc0, $0))
            }
        }
        set {
            let __func0: @convention(block) (JSValue) -> JSValue = {
                return ToyClass2.bjs.putPrimitive(newValue!(ToyClass2.bjs.getString($0)))
            }
            bjsSetProperty("lambdaAutoProp", ToyClass2.bjs.putFunc(newValue, __func0))
        }
    }
    
    var nativeArrayAutoProp: [[[String?]?]?]? {
        get {
            return ToyClass2.bjs.getArray(bjsGetProperty("nativeArrayAutoProp"), {
                return ToyClass2.bjs.getArray($0, {
                    return ToyClass2.bjs.getArray($0, {
                        return ToyClass2.bjs.getString($0)
                    })
                })
            })
        }
        set {
            bjsSetProperty("nativeArrayAutoProp", newValue)
        }
    }
    
    var bjsObjArrayAutoProp: [[[ToyClass2?]?]?]? {
        get {
            return ToyClass2.bjs.getArray(bjsGetProperty("bjsObjArrayAutoProp"), {
                return ToyClass2.bjs.getArray($0, {
                    return ToyClass2.bjs.getArray($0, {
                        return ToyClass2.bjs.getObj($0, ToyClass2.bjsFactory)
                    })
                })
            })
        }
        set {
            bjsSetProperty("bjsObjArrayAutoProp", ToyClass2.bjs.putArray(newValue, {
                return ToyClass2.bjs.putArray($0, {
                    return ToyClass2.bjs.putArray($0, {
                        return ToyClass2.bjs.putObj($0)
                    })
                })
            }))
        }
    }
    
    var anyArrayAutoProp: [[[BjsAnyObject]?]?]? {
        get {
            return ToyClass2.bjs.getArray(bjsGetProperty("anyArrayAutoProp"), {
                return ToyClass2.bjs.getArray($0, {
                    return ToyClass2.bjs.getArray($0, {
                        return ToyClass2.bjs.getAny($0)
                    })
                })
            })
        }
        set {
            bjsSetProperty("anyArrayAutoProp", ToyClass2.bjs.putArray(newValue, {
                return ToyClass2.bjs.putArray($0, {
                    return ToyClass2.bjs.putArray($0, {
                        return $0.jsObj
                    })
                })
            }))
        }
    }
    
    var lambdaArrayAutoProp: [[[((_ strIn: String?) -> String?)?]?]?]? {
        get {
            return ToyClass2.bjs.getArray(bjsGetProperty("lambdaArrayAutoProp"), {
                return ToyClass2.bjs.getArray($0, {
                    return ToyClass2.bjs.getArray($0, { __jsFunc0 in
                        return ToyClass2.bjs.getFunc(__jsFunc0) {
                            return ToyClass2.bjs.getString(ToyClass2.bjs.funcCall(__jsFunc0, $0))
                        }
                    })
                })
            })
        }
        set {
            bjsSetProperty("lambdaArrayAutoProp", ToyClass2.bjs.putArray(newValue, {
                return ToyClass2.bjs.putArray($0, {
                    return ToyClass2.bjs.putArray($0, {
                        __func0 in
                        let __jsFunc0: @convention(block) (JSValue) -> JSValue = {
                            return ToyClass2.bjs.putPrimitive(__func0!(ToyClass2.bjs.getString($0)))
                        }
                        return ToyClass2.bjs.putFunc(__func0, __jsFunc0)
                    })
                })
            }))
        }
    }
    
    var prop: String? {
        get { return ToyClass2.bjs.getString(bjsGetProperty("prop")) }
        set { bjsSetProperty("prop", newValue)}
    }
    
    
    // INSTANCE METHODS
    
    func voidFunc() {
        _ = bjsCall("voidFunc")
    }
    
    func paramsFunc(_ bool: Bool?, _ date: Date?, _ float: Double?, _ int: Int?, _ string: String?, _ any: BjsAnyObject, _ bjsObj: ToyClass2?, _ array: [Int?]?, _ lambda: (() -> String?)?) {
        let __func0: @convention(block) () -> String? = {
            return lambda!()
        }
        _ = bjsCall("paramsFunc", bool, date, float, int, string, any.jsObj, ToyClass2.bjs.putObj(bjsObj), ToyClass2.bjs.putArray(array, {
            return ToyClass2.bjs.putPrimitive($0)
        }), ToyClass2.bjs.putFunc(lambda, __func0))
    }
    
    func boolFunc() -> Bool? {
        return ToyClass2.bjs.getBool(bjsCall("retValueFunc"))
    }
    
    func dateFunc() -> Date? {
        return ToyClass2.bjs.getDate(bjsCall("retValueFunc"))
    }
    
    func floatFunc() -> Double? {
        return ToyClass2.bjs.getFloat(bjsCall("retValueFunc"))
    }
    
    func intFunc() -> Int? {
        return ToyClass2.bjs.getInt(bjsCall("retValueFunc"))
    }
    
    func stringFunc() -> String? {
        return ToyClass2.bjs.getString(bjsCall("retValueFunc"))
    }
    
    func lambdaVoidFunc(_ lambda: (() -> Void)?) -> (() -> Void)? {
        let __func0: @convention(block) () -> Void = {
            lambda!()
        }
        let __jsFunc0 = bjsCall("lambdaVoidFunc", ToyClass2.bjs.putFunc(lambda, __func0))
        return ToyClass2.bjs.getFunc(__jsFunc0) {
            _ = ToyClass2.bjs.funcCall(__jsFunc0)
        }
    }
    
    func lambdaWithParamsFunc(_ lambda: ((_ int: Int?, _ nullStr: String?, _ any: BjsAnyObject, _ obj: ToyClass2?) -> String?)?) {
        let __func0: @convention(block) (JSValue, JSValue, JSValue, JSValue) -> JSValue = {
            return ToyClass2.bjs.putPrimitive(lambda!(ToyClass2.bjs.getInt($0), ToyClass2.bjs.getString($1), ToyClass2.bjs.getAny($2), ToyClass2.bjs.getObj($3, ToyClass2.bjsFactory)))
        }
        _ = bjsCall("lambdaWithParamsFunc", ToyClass2.bjs.putFunc(lambda, __func0))
    }
    
    func returningLambdaWithParamsFunc() -> ((_ int: Int?, _ any: BjsAnyObject, _ obj: ToyClass1?, _ array: [Int?]?) -> String?)? {
        let __jsFunc0 = bjsCall("returningLambdaWithParamsFunc")
        return ToyClass2.bjs.getFunc(__jsFunc0) {
            return ToyClass2.bjs.getString(ToyClass2.bjs.funcCall(__jsFunc0, $0, $1.jsObj, ToyClass2.bjs.putObj($2), ToyClass2.bjs.putArray($3, {
                return ToyClass2.bjs.putPrimitive($0)
            })))
        }
    }
    
    
    // BJS HELPERS
    
    private static var _bjsLocator = BjsLocator("TestProject", "ToyClass2")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    override class func bjsFactory(_ jsObject: JSValue) -> ToyClass2 { ToyClass2(jsObject) }
}
