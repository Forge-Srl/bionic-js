import Foundation
import Bjs

@objc(BjsGeoPoint)
class BjsGeoPoint : BjsProject {
    
    override class func initialize(_ bjs: Bjs) {
        bjs.loadBundle(BjsGeoPoint.self, "BusinessLogic")
    }
}