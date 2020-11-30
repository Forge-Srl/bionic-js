import JavaScriptCore
import Bjs

class FerrariCalifornia: MotorVehicle {
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "FerrariCalifornia")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    override class func bjsFactory(_ jsObject: JSValue) -> FerrariCalifornia { FerrariCalifornia(jsObject) }
}