import JavaScriptCore
import Bjs

class TeslaRoadster: MotorVehicle {
    
    class var `default`:TeslaRoadster? {
        get {
            return Bjs.get.getObj(Bjs.get.getProperty(self.bjsClass, "default"), TeslaRoadster.bjsFactory)
        }
    }
    
    var serialized:BjsAnyObject {
        get {
            return Bjs.get.getAny(bjsGetProperty("serialized"))
        }
    }
    
    var canTravelInTheSpace:Bool? {
        get {
            return Bjs.get.getBool(bjsGetProperty("canTravelInTheSpace"))
        }
    }
    
    override class func bjsFactory(_ jsObject: JSValue) -> TeslaRoadster {
        return TeslaRoadster(jsObject)
    }
    
    override class var bjsModulePath: String {
        return "/TeslaRoadster"
    }
}