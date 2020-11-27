import Foundation

@objc(BjsTestProject)
class BjsTestProject : BjsProject {
    
    override class func initialize(_ bjs: Bjs) {
        bjs.loadBundle(BjsTestProject.self, "test")
        bjs.addNativeWrapper(ToyComponent1BjsWrapper.self)
    }
}
