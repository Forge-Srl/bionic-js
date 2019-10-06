import JavaScriptCore
import Bjs

class TeslaRoadster: MotorVehicle {
    
    var canTravelInTheSpace:Bool? {
        get {
            return Bjs.get.getBool(bjsGetProperty("canTravelInTheSpace"))
        }
    }
    
    override class func bjsFactory(_ jsObject: JSValue) -> TeslaRoadster {
        return TeslaRoadster(jsObject)
    }
    
    override class var bjsModulePath: String {
        return "TeslaRoadster.js"
    }
}