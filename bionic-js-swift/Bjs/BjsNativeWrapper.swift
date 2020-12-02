import JavaScriptCore

open class BjsNativeWrapper {
    
    open class var bjsLocator: BjsLocator { BjsLocator() }
    open class var bjs: Bjs { bjsLocator.get }
   
    class func bjsGetNativeFunctions(_ context: BjsContext) -> JSValue? {
        let nativeExports = context.createNativeExports()
        bjsBind(nativeExports)
        return bjsExportFunctions(nativeExports).exportsObj
    }
    
    open class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        fatalError("bjsExportFunctions should be implemented")
    }
    
    open class func bjsBind(_ nativeExports: BjsNativeExports) {
        fatalError("bjsBind should be implemented")
    }
}
