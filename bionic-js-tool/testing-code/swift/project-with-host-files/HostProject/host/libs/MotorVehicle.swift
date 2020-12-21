import JavaScriptCore
import Bjs

class MotorVehicle: Vehicle {
    
    convenience init(_ weight: Int?, _ seats: Int?, _ maxSpeed: Int?, _ fuelType: FuelType?, _ maxRange: Double?, _ currentRange: Double?) {
        self.init(MotorVehicle.bjsClass, [MotorVehicle.bjs.putPrimitive(weight), MotorVehicle.bjs.putPrimitive(seats), MotorVehicle.bjs.putPrimitive(maxSpeed), MotorVehicle.bjs.putObj(fuelType), MotorVehicle.bjs.putPrimitive(maxRange), MotorVehicle.bjs.putPrimitive(currentRange)])
    }
    
    var isOnReserve:Bool? {
        get {
            return MotorVehicle.bjs.getBool(bjsGetProperty("isOnReserve"))
        }
    }
    
    var engine:Engine? {
        get {
            return MotorVehicle.bjs.getWrapped(bjsGetProperty("engine"), Engine.self)
        }
    }
    
    func refuel() -> Double? {
        return MotorVehicle.bjs.getFloat(bjsCall("refuel"))
    }
    
    func watchEngine(_ observer: (() -> String?)?) {
        let nativeFunc_bjs0 = observer
        let jsFunc_bjs1: @convention(block) () -> JSValue = {
            return MotorVehicle.bjs.putPrimitive(nativeFunc_bjs0!())
        }
        _ = bjsCall("watchEngine", MotorVehicle.bjs.putFunc(nativeFunc_bjs0, jsFunc_bjs1))
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "MotorVehicle")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    override class func bjsFactory(_ jsObject: JSValue) -> MotorVehicle { MotorVehicle(jsObject) }
}