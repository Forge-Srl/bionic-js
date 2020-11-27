import JavaScriptCore
import Bjs

class Vehicle: BjsObject {
    
    var description:String? {
        get {
            return Vehicle.bjs.getString(bjsGetProperty("description"))
        }
    }
    
    var weight:Double? {
        get {
            return Vehicle.bjs.getFloat(bjsGetProperty("weight"))
        }
        set {
            bjsSetProperty("weight", Vehicle.bjs.putPrimitive(newValue))
        }
    }
    
    var seats:Int? {
        get {
            return Vehicle.bjs.getInt(bjsGetProperty("seats"))
        }
    }
    
    var maxSpeed:Int? {
        get {
            return Vehicle.bjs.getInt(bjsGetProperty("maxSpeed"))
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "Vehicle")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    class func bjsFactory(_ jsObject: JSValue) -> Vehicle { Vehicle(jsObject) }
}