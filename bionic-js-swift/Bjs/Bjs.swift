import JavaScriptCore

public class Bjs {
    
    public typealias Factory<T: BjsObject> = (_ jsObj: JSValue) -> T
        
    private static let bjsWrapperObjFieldName = "bjsWrapperObj",
                       bjsWrapperObjFieldUnboundValue = "unbound",
                       bjsNativeObjFieldName = "bjsNativeObj"
    
    private static var projects = [String : Bjs]()
    
    public var jsNull: JSValue { return context.createJsNull() }
    public var anyNull: BjsAnyObject { return getAny(jsNull) }

    let projectName: String
    
    var context: BjsContext!,
        jsValueToNative = [BjsNativeObjectIdentifier : BjsObject](),
        modulesCache = [String : JSValue]()

    
    static func get(_ projectName: String) -> Bjs {
        if let cachedBjs = projects[projectName] {
            return cachedBjs
        } else {
            let bjs = Bjs(projectName)
            if let initializerClass = NSClassFromString("Bjs\(projectName)") {
                (initializerClass as! BjsProject.Type).initialize(bjs)
            }
            projects[projectName] = bjs
            return bjs
        }
    }
    
    static func clear(_ projectName: String) {
        Bjs.projects[projectName] = nil
    }
    
    init(_ projectName: String) {
        self.projectName = projectName
    }
        
    public func loadBundle(_ forClass: AnyClass, _ bundleName: String) {
        jsValueToNative.removeAll()
        modulesCache.removeAll()
        context = BjsContext(projectName)
        
        let bundle = BjsBundle(forClass, "\(bundleName).bjs")
        guard let bundleContent = bundle.loadFile("\(bundleName).js") else {
            fatalError("cannot load bundle \"\(bundleName)\" file")
        }
        _ = context.executeJs(bundleContent)
    }
    
    public func addNativeWrapper(_ nativeWrapperClass: BjsNativeWrapper.Type) {
        context.addNativeWrappers(nativeWrapperClass)
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
    }
    
    public func putWrapped(_ native: Any?, _ nativeWrapperClass: BjsNativeWrapper.Type) -> JSValue {
        if native == nil {
            return jsNull
        }
        if let jsObj = context.createJsObject(native) {
            let jsWrapperObj = jsObj.objectForKeyedSubscript(Bjs.bjsWrapperObjFieldName)
            if jsWrapperObj == nil || jsWrapperObj!.isUndefined {
                jsObj.setObject(Bjs.bjsWrapperObjFieldUnboundValue, forKeyedSubscript: Bjs.bjsWrapperObjFieldName as NSString)
                let newJsWrapperObj = self.loadModule(nativeWrapperClass.bjsLocator.moduleName).construct(withArguments: [jsObj])!
                
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
        return jsNativeObj.toObjectOf(T.self as? AnyClass) as? T
    }
    
    public func getWrapped<T>(_ jsWrapperObj: JSValue, _ nativeClass: T.Type) -> T? {
        if Bjs.isNullOrUndefined(jsWrapperObj) {
            return nil
        }
        
        unprotect(jsWrapperObj) // Without this, the wrapped object is not dealocated
        if let jsObj = jsWrapperObj.objectForKeyedSubscript(Bjs.bjsNativeObjFieldName) {
            unprotect(jsObj) // Without this, the wrapped object is not dealocated
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
            context.logError("js object is not an array as expected")
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
    
    
    // MODULES AND ENVIRONMENT
    
    func loadModule(_ moduleName: String) -> JSValue {
        if let cachedModule = modulesCache[moduleName] {
            return cachedModule
        }
        if context == nil {
            fatalError("Bjs context was not initialized")
        }
        guard let export = context.getModule(moduleName) else {
            fatalError("JS module \"\(moduleName)\" was not found in Bjs bundle")
        }
        let module = export.objectForKeyedSubscript(moduleName)!
        if module.isUndefined {
            fatalError("JS module \"\(moduleName)\" must be exported with the notation \"module.exports = {\(moduleName)}\"")
        }
        modulesCache[moduleName] = module
        return module
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
            return
        }
        context.logError("bjs object \"\(String(describing: bjsObj.self))\" was initialized with a js object already bound with another bjs object")
    }
}
