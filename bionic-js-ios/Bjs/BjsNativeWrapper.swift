/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import JavaScriptCore

open class BjsNativeWrapper {
    
    open class var wrapperPath: String { return "" }
    open class var name: String { return "" }
   
    class func bjsGetNativeFunctions(_ context: BjsContext) -> JSValue? {
        let nativeExports = context.createNativeExports()
        bjsExportFunctions(nativeExports)
        return nativeExports.exportsObject
    }
    
    open class func bjsExportFunctions(_ nativeExports: BjsNativeExports) { }
}
