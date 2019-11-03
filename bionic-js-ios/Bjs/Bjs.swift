/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import JavaScriptCore

public class Bjs {
    static let bjsWrapperObjFieldName = "bjsWrapperObj"
    static let bjsWrapperObjFieldUnboundValue = "unbound"
    static let bjsNativeObjFieldName = "bjsNativeObj"
    
    public typealias Factory<T: BjsObject> = (_ jsObj: JSValue) -> T
    public static var jsBundleName: String? = nil
    public static var get = Bjs()
    public var jsNull: JSValue { return context.createJsNull() }
    public var customBundles: BjsCustomBundles { return context.appBundle.customBundles }
    
    let context: BjsModules
    var jsValueToNative: [BjsNativeObjectIdentifier : BjsObject]
    var modulesCache: [String : JSValue]
    
    init() {
        if Bjs.jsBundleName == nil {
            fatalError("BjsEnvironment.initialize() must be called before using Bjs classes")
        }
        context = BjsModules(BjsBundle(Bjs.jsBundleName!))
        jsValueToNative = [BjsNativeObjectIdentifier : BjsObject]()
        modulesCache = [String : JSValue]()
    }
    
    
    // JS FUNCTIONS CALL
    
    public func call(_ jsClass: JSValue, _ name: String, _ arguments: Any?...) -> JSValue {
        return jsClass.invokeMethod(name, withArguments: arguments.map({$0 as Any}))
    }
    
    public func funcCall(_ jsFunc: JSValue, _ arguments: Any?...) -> JSValue {
        return jsFunc.call(withArguments: arguments.map({$0 as Any}))
    }
    
    
    // JS PROPERTIES
    
    public func getProperty(_ jsClass: JSValue, _ name: String) -> JSValue {
        return jsClass.objectForKeyedSubscript(name)
    }
    
    public func setProperty(_ jsClass: JSValue, _ name: String, _ value: Any?) {
        jsClass.setObject(value, forKeyedSubscript: name as NSString)
    }
    
    
    // PUT (NATIVE -> JS)
    
    public func putPrimitive(_ primitive: Any?) -> JSValue {
        return primitive != nil ? context.createJsObject(primitive) : jsNull
    }
    
    public func putNative(_ native: Any?) -> JSValue {
        if native == nil {
            return jsNull
        }
        return context.createJsObject(native)
        // TODO: should unprotect be called on returned object, also without a wrapper?
    }
    
    public func putWrapped(_ native: Any?, _ nativeWrapperClass: BjsNativeWrapper.Type) -> JSValue {
        if native == nil {
            return jsNull
        }
        if let jsObj = context.createJsObject(native) {
            //unprotect(jsObj) TODO
            let jsWrapperObj = jsObj.objectForKeyedSubscript(Bjs.bjsWrapperObjFieldName)
            if jsWrapperObj == nil || jsWrapperObj!.isUndefined {
                jsObj.setObject(Bjs.bjsWrapperObjFieldUnboundValue, forKeyedSubscript: Bjs.bjsWrapperObjFieldName as NSString)
                let wrapperClass = self.loadModule(nativeWrapperClass.wrapperPath)
                
                let newJsWrapperObj = wrapperClass.construct(withArguments: [jsObj])!
                //unprotect(newJsWrapperObj) TODO
                
                return newJsWrapperObj
            } else {
                return jsWrapperObj!
            }
        } else {
            return jsNull
        }
    }
    
    public func putObj(_ bjsObj: BjsObject?) -> JSValue {
        return bjsObj != nil ? bjsObj!.bjsObj : jsNull
    }
    
    public func putFunc<N, J>(_ nativeFunc: N?, _ jsFuncCaller: J) -> JSValue {
        return nativeFunc == nil ? jsNull : context.createJsObject(unsafeBitCast(jsFuncCaller, to: AnyObject.self))
    }
    
    public func putArray<T>(_ nativeArray: [T]?, _ elementConverter: (_ nativeElement: T) -> AnyObject) -> JSValue {
        guard let array = nativeArray else {
            return jsNull
        }
        let jsArray = context.executeJs("new Array(\(array.count))")
        if !array.isEmpty {
            for index in 0...array.count - 1 {
                jsArray?.setObject(elementConverter(nativeArray![index]), atIndexedSubscript: index)
            }
        }
        return jsArray!
    }
    
    
    // GET (JS -> NATIVE)
    
    public func getBool(_ jsObj: JSValue) -> Bool? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : jsObj.toBool()
    }
    
    public func getDate(_ jsObj: JSValue) -> Date? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : jsObj.toDate()
    }
    
    public func getFloat(_ jsObj: JSValue) -> Double? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : jsObj.toDouble()
    }
    
    public func getInt(_ jsObj: JSValue) -> Int? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : jsObj.toNumber().intValue
    }
    
    public func getString(_ jsObj: JSValue) -> String? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : jsObj.toString()
    }
    
    public func getFunc<T>(_ jsObj: JSValue, _ nativeCallerFunc: T) -> T? {
        return Bjs.isNullOrUndefined(jsObj) ? nil : nativeCallerFunc
    }
    
    public func getAny(_ jsObj: JSValue) -> BjsAnyObject {
        return BjsAnyObject(jsObj)
    }
    
    public func getNative<T>(_ jsNativeObj: JSValue, _ nativeClass: T.Type) -> T? {
        if Bjs.isNullOrUndefined(jsNativeObj) {
            return nil
        }
        // TODO: should unprotect be called on jsObj also without a wrapper?
        return jsNativeObj.toObjectOf(T.self as? AnyClass) as? T
    }
    
    public func getWrapped<T>(_ jsWrapperObj: JSValue, _ nativeClass: T.Type) -> T? {
        if Bjs.isNullOrUndefined(jsWrapperObj) {
            return nil
        }
        
        unprotect(jsWrapperObj)
        if let jsObj = jsWrapperObj.objectForKeyedSubscript(Bjs.bjsNativeObjFieldName) {
            unprotect(jsObj)
            return jsObj.toObjectOf(T.self as? AnyClass) as? T
        } else {
            return nil
        }
    }
    
    public func getObj<T: BjsObject>(_ jsObj: JSValue, _ bjsFactory: Factory<T>) -> T? {
        if Bjs.isNullOrUndefined(jsObj) {
            return nil
        }
        let nativeObjectIdentifier = BjsNativeObjectIdentifier(jsObj, T.self)
        var nativeObject = jsValueToNative[nativeObjectIdentifier]
        if nativeObject == nil {
            nativeObject = bjsFactory(jsObj)
            jsValueToNative[nativeObjectIdentifier] = nativeObject
        }
        return nativeObject as? T
    }
    
    public func getArray<T>(_ jsArrayObject: JSValue, _ elementConverter: (_ jsElement: JSValue) -> T) -> [T]? {
        if Bjs.isNullOrUndefined(jsArrayObject) {
            return nil
        }
        var bjsArray = [T]()
        let lengthJs = jsArrayObject.objectForKeyedSubscript("length")!
        if jsArrayObject.isArray && lengthJs.isNumber {
            let arrayLength = lengthJs.toNumber().intValue
            if arrayLength > 0 {
                for i in 0...arrayLength - 1 {
                    bjsArray.append(elementConverter(jsArrayObject.atIndex(i)!))
                }
            }
        } else {
            Bjs.get.context.logError("Js object is not an array as expected")
        }
        let immutableArray = Array(bjsArray)
        return immutableArray
    }
    
    
    // WRAPPERS
    
    public func getBound<T>(_ jsObj: JSValue, _ nativeClass: T.Type) -> T? {
        if jsObj.isInstance(of: nativeClass) {
            let bjsWrapperObj = jsObj.objectForKeyedSubscript(Bjs.bjsWrapperObjFieldName)!
            if bjsWrapperObj.toString() == Bjs.bjsWrapperObjFieldUnboundValue {
                return jsObj.toObjectOf(T.self as? AnyClass) as? T
            }
        }
        return nil
    }
    
    public func bindNative(_ native: Any!, _ wrapper: JSValue) -> Void {
        if let nativeJsObj = context.createJsObject(native) {
            wrapper.setObject(nativeJsObj, forKeyedSubscript: Bjs.bjsNativeObjFieldName as NSString)
            nativeJsObj.setObject(wrapper, forKeyedSubscript: Bjs.bjsWrapperObjFieldName as NSString)
        }
    }
    
    public func addNativeWrapper(_ nativeWrapperClass: BjsNativeWrapper.Type) {
        context.addNativeWrappers(nativeWrapperClass)
    }
    
    
    // MODULES AND ENVIRONMENT
    
    public func loadModule(_ modulePath: String) -> JSValue {
        if let cachedModule = modulesCache[modulePath] {
            return cachedModule
        }
        let module = context.load(modulePath)
        modulesCache[modulePath] = module
        return module
    }
    
    public func clearJsEnvironment() {
        context.removeAllNativeWrappers()
        context.clearNodeLoader()
        jsValueToNative.removeAll()
        modulesCache.removeAll()
    }
    
    
    // NON PUBLIC
    
    static func isNullOrUndefined(_ jsObj: JSValue) -> Bool {
        return jsObj.isNull || jsObj.isUndefined
    }
    
    func unprotect(_ jsUbj: JSValue) {
        JSValueUnprotect(context.jsContext.jsGlobalContextRef, jsUbj.jsValueRef)
    }
    
    func createNativeObj(_ jsObj: JSValue, _ bjsObj: BjsObject) {
        let nativeObjectIdentifier = BjsNativeObjectIdentifier(jsObj, type(of:bjsObj))
        if jsValueToNative[nativeObjectIdentifier] == nil {
            jsValueToNative[nativeObjectIdentifier] = bjsObj
            return;
        }
        context.logError("bjs object was already created from this js object")
    }
}
