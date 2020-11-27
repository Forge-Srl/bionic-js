import Foundation
import Bjs

@objc(BjsBeautifulVehicles)
class BjsBeautifulVehicles : BjsProject {
    
    override class func initialize(_ bjs: Bjs) {
        bjs.loadBundle(BjsBeautifulVehicles.self, "Vehicles")
    }
}