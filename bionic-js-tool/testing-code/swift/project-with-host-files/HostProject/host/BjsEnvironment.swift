import Bjs

class BjsEnvironment {
    
    static func initialize() {
        Bjs.setBundle(BjsEnvironment.self, "package")
        Bjs.get.addNativeWrapper(EngineWrapper.self)
    }
}