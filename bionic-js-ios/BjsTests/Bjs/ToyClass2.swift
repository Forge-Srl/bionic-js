import JavaScriptCore
import Bjs

// TODO: allineare i metodi con ToyClass1 e aggiungere test mancanti

class ToyClass2: ToyClass1 {
    
    // CONSTRUCTOR
    
    convenience init(_ bool: Bool?) {
        self.init(ToyClass2.bjsClass, [bool])
    }
    
    
    // INSTANCE PROPERTIES
    
    var nativeAutoProp: String? {
        get { return Bjs.get.getString(bjsGetProperty("nativeAutoProp")) }
        set { bjsSetProperty("nativeAutoProp", newValue)}
    }
    
    var anyAutoProp: BjsAnyObject {
        get { return Bjs.get.getAny(bjsGetProperty("anyAutoProp")) }
        set { bjsSetProperty("anyAutoProp", newValue.jsObj)}
    }
    
    var bjsObjAutoProp: ToyClass2? {
        get { return Bjs.get.getObj(bjsGetProperty("bjsObjAutoProp"), ToyClass2.bjsFactory) }
        set { bjsSetProperty("bjsObjAutoProp", Bjs.get.putObj(newValue))}
    }
    
    var lambdaAutoProp: ((_ strIn: String?) -> String?)? {
        get {
            let __jsFunc0 = bjsGetProperty("lambdaAutoProp")
            return Bjs.get.getFunc(__jsFunc0) {
                return Bjs.get.getString(Bjs.get.funcCall(__jsFunc0, $0))
            }
        }
        set {
            let __func0: @convention(block) (JSValue) -> JSValue = {
                return Bjs.get.putPrimitive(newValue!(Bjs.get.getString($0)))
            }
            bjsSetProperty("lambdaAutoProp", Bjs.get.putFunc(newValue, __func0))
        }
    }
    
    var nativeArrayAutoProp: [[[String?]?]?]? {
        get {
            return Bjs.get.getArray(bjsGetProperty("nativeArrayAutoProp"), {
                return Bjs.get.getArray($0, {
                    return Bjs.get.getArray($0, {
                        return Bjs.get.getString($0)
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
            return Bjs.get.getArray(bjsGetProperty("bjsObjArrayAutoProp"), {
                return Bjs.get.getArray($0, {
                    return Bjs.get.getArray($0, {
                        return Bjs.get.getObj($0, ToyClass2.bjsFactory)
                    })
                })
            })
        }
        set {
            bjsSetProperty("bjsObjArrayAutoProp", Bjs.get.putArray(newValue, {
                return Bjs.get.putArray($0, {
                    return Bjs.get.putArray($0, {
                        return Bjs.get.putObj($0)
                    })
                })
            }))
        }
    }
    
    var anyArrayAutoProp: [[[BjsAnyObject]?]?]? {
        get {
            return Bjs.get.getArray(bjsGetProperty("anyArrayAutoProp"), {
                return Bjs.get.getArray($0, {
                    return Bjs.get.getArray($0, {
                        return Bjs.get.getAny($0)
                    })
                })
            })
        }
        set {
            bjsSetProperty("anyArrayAutoProp", Bjs.get.putArray(newValue, {
                return Bjs.get.putArray($0, {
                    return Bjs.get.putArray($0, {
                        return $0.jsObj
                    })
                })
            }))
        }
    }
    
    var lambdaArrayAutoProp: [[[((_ strIn: String?) -> String?)?]?]?]? {
        get {
            return Bjs.get.getArray(bjsGetProperty("lambdaArrayAutoProp"), {
                return Bjs.get.getArray($0, {
                    return Bjs.get.getArray($0, { __jsFunc0 in
                        return Bjs.get.getFunc(__jsFunc0) {
                            return Bjs.get.getString(Bjs.get.funcCall(__jsFunc0, $0))
                        }
                    })
                })
            })
        }
        set {
            bjsSetProperty("lambdaArrayAutoProp", Bjs.get.putArray(newValue, {
                return Bjs.get.putArray($0, {
                    return Bjs.get.putArray($0, {
                        __func0 in
                        let __jsFunc0: @convention(block) (JSValue) -> JSValue = {
                            return Bjs.get.putPrimitive(__func0!(Bjs.get.getString($0)))
                        }
                        return Bjs.get.putFunc(__func0, __jsFunc0)
                    })
                })
            }))
        }
    }
    
    var prop: String? {
        get { return Bjs.get.getString(bjsGetProperty("prop")) }
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
        _ = bjsCall("paramsFunc", bool, date, float, int, string, any.jsObj, Bjs.get.putObj(bjsObj), Bjs.get.putArray(array, {
            return Bjs.get.putPrimitive($0)
        }), Bjs.get.putFunc(lambda, __func0))
    }
    
    func boolFunc() -> Bool? {
        return Bjs.get.getBool(bjsCall("retValueFunc"))
    }
    
    func dateFunc() -> Date? {
        return Bjs.get.getDate(bjsCall("retValueFunc"))
    }
    
    func floatFunc() -> Double? {
        return Bjs.get.getFloat(bjsCall("retValueFunc"))
    }
    
    func intFunc() -> Int? {
        return Bjs.get.getInt(bjsCall("retValueFunc"))
    }
    
    func stringFunc() -> String? {
        return Bjs.get.getString(bjsCall("retValueFunc"))
    }
    
    func lambdaVoidFunc(_ lambda: (() -> Void)?) -> (() -> Void)? {
        let __func0: @convention(block) () -> Void = {
            lambda!()
        }
        let __jsFunc0 = bjsCall("lambdaVoidFunc", Bjs.get.putFunc(lambda, __func0))
        return Bjs.get.getFunc(__jsFunc0) { () -> Void in
            _ = Bjs.get.funcCall(__jsFunc0)
        }
    }
    
    func lambdaWithParamsFunc(_ lambda: ((_ int: Int?, _ nullStr: String?, _ any: BjsAnyObject, _ obj: ToyClass2?) -> String?)?) {
        let __func0: @convention(block) (JSValue, JSValue, JSValue, JSValue) -> JSValue = {
            return Bjs.get.putPrimitive(lambda!(Bjs.get.getInt($0), Bjs.get.getString($1), Bjs.get.getAny($2), Bjs.get.getObj($3, ToyClass2.bjsFactory)))
        }
        _ = bjsCall("lambdaWithParamsFunc", Bjs.get.putFunc(lambda, __func0))
    }
    
    func returningLambdaWithParamsFunc() -> ((_ int: Int?, _ any: BjsAnyObject, _ obj: ToyClass1?, _ array: [Int?]?) -> String?)? {
        let __jsFunc0 = bjsCall("returningLambdaWithParamsFunc")
        return Bjs.get.getFunc(__jsFunc0) {
            return Bjs.get.getString(Bjs.get.funcCall(__jsFunc0, $0, $1.jsObj, Bjs.get.putObj($2), Bjs.get.putArray($3, {
                return Bjs.get.putPrimitive($0)
            })))
        }
    }
    
    
    // BJS HELPERS
    
    override class var bjsModulePath: String {
        return "/_bundle_/test/src/ToyClass2"
    }
    
    override class func bjsFactory(_ jsObject: JSValue) -> ToyClass2 {
        return ToyClass2(jsObject)
    }
}
