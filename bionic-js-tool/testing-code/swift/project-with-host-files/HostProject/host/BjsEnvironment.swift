import Bjs

class BjsEnvironment {
    
    static func initialize() {
        Bjs.jsBundleName = "package"
        Bjs.get.addNativeWrapper(EngineWrapper.self)
    }
}