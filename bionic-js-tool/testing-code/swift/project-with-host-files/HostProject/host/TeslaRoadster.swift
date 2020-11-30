import JavaScriptCore
import Bjs

class TeslaRoadster: MotorVehicle {
    
    class var `default`:TeslaRoadster? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "default"), TeslaRoadster.bjsFactory)
        }
    }
    
    var serialized:BjsAnyObject {
        get {
            return TeslaRoadster.bjs.getAny(bjsGetProperty("serialized"))
        }
    }
    
    var canTravelInTheSpace:Bool? {
        get {
            return TeslaRoadster.bjs.getBool(bjsGetProperty("canTravelInTheSpace"))
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "TeslaRoadster")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    override class func bjsFactory(_ jsObject: JSValue) -> TeslaRoadster { TeslaRoadster(jsObject) }
}