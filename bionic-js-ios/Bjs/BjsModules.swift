/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import JavaScriptCore

class BjsModules : BjsContext {
    
    let bootstrapFile = "bootstrap.js"
    let bootstrapBundle: BjsBundle
    let appBundle: BjsBundle
    var nativeWrappers: [String : BjsNativeWrapper.Type]
    
    var _nodeJsModule: JSValue?
    var nodeJsModule: JSValue {
        if _nodeJsModule == nil { runBootstrapCode() }
        return _nodeJsModule!
    }
    
    init(_ appBundle: BjsBundle, _ bootstrapBundleName: String = "BjsBootstrap") {
        self.appBundle = appBundle
        bootstrapBundle = BjsBundle(BjsModules.self, bootstrapBundleName)
        nativeWrappers = [String : BjsNativeWrapper.Type]()
    }
    
    func load(_ modulePath: String) -> JSValue {
        
        let jsValue = nodeJsModule.invokeMethod("_load", withArguments: [modulePath, createJsNull() as Any, false])!
        if jsValue.isUndefined {
            logError("cannot load js module \"\(modulePath)\"")
        }
        return jsValue
    }
    
    func addNativeWrappers(_ nativeWrapperClass: BjsNativeWrapper.Type) {
        
        if nativeWrapperClass.name == "" || nativeWrapperClass.wrapperPath == "" {
            fatalError("invalid native wrapper")
        }
        
        if nativeWrappers[nativeWrapperClass.name] != nil {
            fatalError("native wrapper \"\(nativeWrapperClass.name)\" was already added")
        }
        nativeWrappers[nativeWrapperClass.name] = nativeWrapperClass
    }
    
    func removeAllNativeWrappers() {
        nativeWrappers.removeAll()
    }
    
    func clearNodeLoader() {
        _nodeJsModule = nil
    }
    
    private func runBootstrapCode() {
        
        let nativeExport = createNativeExports()
            .exportFunction("executeContent", executeContentFunction())
            .exportFunction("executeFile", executeFileFunction())
            .exportFunction("fileStat", fileStatFunction())
            .exportFunction("readFile", readFileFunction())
            .exportFunction("isInternalModule", isInternalModuleFunction())
            .exportFunction("getInternalModule", getInternalModuleFunction())
        
        guard let bootstrapCode = bootstrapBundle.loadFile(bootstrapFile) else {
            
            logError("cannot find '\(bootstrapFile)' in bundle '\(appBundle.name)'")
            return
        }
        
        // Bootstrap JS file contains a function that takes native dependencies as parameter
        let bootstrapFunction = executeJs("(\(bootstrapCode))", "bundles/\(appBundle.name)/\(bootstrapFile)")
        _nodeJsModule = bootstrapFunction?.call(withArguments: [nativeExport.nativeObj])
    }
    
    private func executeContentFunction() -> @convention(block) (_ : String, _ : String, _ : JSValue, _ : JSValue) -> () {
        
        return { fileContent, filePath, globals, tailCode in
            
            self.executeJsContent(fileContent: fileContent, filePath: filePath, globals: globals, tailCode: tailCode)
        }
    }
    
    private func executeFileFunction() -> @convention(block) (_ : String, _ : JSValue, _ : JSValue) -> () {
        
        return { filePath, globals, tailCode in
            
            guard let fileContent = self.bootstrapBundle.loadFile(filePath) else {
                
                self.setJsExceptionToThrow("js file not found: \(filePath)")
                return
            }
            self.executeJsContent(fileContent: fileContent, filePath: filePath, globals: globals, tailCode: tailCode)
        }
    }
    
    private func executeJsContent (fileContent : String, filePath: String, globals: JSValue, tailCode: JSValue) {
        
        var globalsNames = [String]()
        var globalsValues = [JSValue]()
        let moduleGlobalsLength = globals.objectForKeyedSubscript("length").toNumber().intValue
        for i in 0...moduleGlobalsLength - 1 {
            
            let global = globals.atIndex(i)!
            globalsNames.append(global.atIndex(0).toString())
            globalsValues.append(global.atIndex(1))
        }
        let globalParameters = globalsNames.joined(separator: ",")
        
        let tailCodeString = tailCode.isUndefined ? "" : "\n" + tailCode.toString()
        
        // NodeJS modules loaded during bootstrap are wrapped inside a function and called with arguments provided
        // by JS in bootstrapFile
        
        let functionToCall = self.executeJs("(function(\(globalParameters)){\(fileContent)\(tailCodeString)})", filePath)
        _ = functionToCall?.call(withArguments: globalsValues)
        
        if let internalException = getJsException() {
            setJsExceptionToThrow("error compiling \(filePath): \(internalException.description)")
        }
    }
    
    private func fileStatFunction() -> @convention(block) (_ : String) -> JSValue {
        
        return { path in
            
            guard let filePath = self.appBundle.getFilePath(path) else {
                
                return self.createJsObject(-2) // File not found code ENOENT = 2
            }
            
            var isDirObjC : ObjCBool = false
            let exists = FileManager.default.fileExists(atPath: filePath, isDirectory: &isDirObjC)
            let isDir = isDirObjC.boolValue
            return self.createJsObject(exists ? isDir ? 1 : 0 : -2) // File not found code ENOENT = 2
        }
    }
    
    private func readFileFunction() -> @convention(block) (_ : String) -> JSValue {
        
        return { path in
            
            guard let fileContent = self.appBundle.loadFile(path) else {
                
                self.setJsExceptionToThrow("file not found: \(path)")
                return self.createJsNull()
            }
            return self.createJsObject(fileContent)
        }
    }
    
    private func isInternalModuleFunction() -> @convention(block) (_ : String) -> (Bool) {
        
        return { moduleName in
            return self.nativeWrappers[moduleName] != nil
        }
    }
    
    private func getInternalModuleFunction() -> @convention(block) (_ : String) -> (JSValue) {
        
        return { moduleName in
            return self.nativeWrappers[moduleName]!.bjsGetNativeFunctions(self)!
        }
    }
}
