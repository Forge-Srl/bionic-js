import JavaScriptCore
import Bjs

class Bicycle: Vehicle {
    
    func ride() {
        _ = bjsCall("ride")
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "Bicycle")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    override class func bjsFactory(_ jsObject: JSValue) -> Bicycle { Bicycle(jsObject) }
}