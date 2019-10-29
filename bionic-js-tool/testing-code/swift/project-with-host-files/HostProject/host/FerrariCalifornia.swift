import JavaScriptCore
import Bjs

class FerrariCalifornia: MotorVehicle {
    
    override class func bjsFactory(_ jsObject: JSValue) -> FerrariCalifornia {
        return FerrariCalifornia(jsObject)
    }
    
    override class var bjsModulePath: String {
        return "FerrariCalifornia.js"
    }
}