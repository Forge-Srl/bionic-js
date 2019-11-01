import JavaScriptCore
import Bjs

class MotorVehicle: Vehicle {
    
    var isOnReserve:Bool? {
        get {
            return Bjs.get.getBool(bjsGetProperty("isOnReserve"))
        }
    }
    
    var engine:Engine? {
        get {
            return Bjs.get.getWrapped(bjsGetProperty("engine"), Engine.self)
        }
    }
    
    func refuel() -> Double? {
        return Bjs.get.getFloat(bjsCall("refuel"))
    }
    
    func watchEngine(_ observer: (() -> String?)?) {
        let nativeFunc_bjs0 = observer
        let jsFunc_bjs1: @convention(block) () -> JSValue = {
            return Bjs.get.putPrimitive(nativeFunc_bjs0!())
        }
        _ = bjsCall("watchEngine", Bjs.get.putFunc(nativeFunc_bjs0, jsFunc_bjs1))
    }
    
    override class func bjsFactory(_ jsObject: JSValue) -> MotorVehicle {
        return MotorVehicle(jsObject)
    }
    
    override class var bjsModulePath: String {
        return "/libs/MotorVehicle"
    }
}