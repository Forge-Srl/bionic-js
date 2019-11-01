import JavaScriptCore
import Bjs

class Vehicle: BjsObject {
    
    var description:String? {
        get {
            return Bjs.get.getString(bjsGetProperty("description"))
        }
    }
    
    var weight:Double? {
        get {
            return Bjs.get.getFloat(bjsGetProperty("weight"))
        }
        set {
            bjsSetProperty("weight", Bjs.get.putPrimitive(newValue))
        }
    }
    
    var seats:Int? {
        get {
            return Bjs.get.getInt(bjsGetProperty("seats"))
        }
    }
    
    var maxSpeed:Int? {
        get {
            return Bjs.get.getInt(bjsGetProperty("maxSpeed"))
        }
    }
    
    class func bjsFactory(_ jsObject: JSValue) -> Vehicle {
        return Vehicle(jsObject)
    }
    
    override class var bjsModulePath: String {
        return "/libs/Vehicle"
    }
}