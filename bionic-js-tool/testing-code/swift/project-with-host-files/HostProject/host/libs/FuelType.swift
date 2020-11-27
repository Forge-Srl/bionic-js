import JavaScriptCore
import Bjs

class FuelType: BjsObject {
    
    class var Electricity:FuelType? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "Electricity"), FuelType.bjsFactory)
        }
    }
    
    class var NaturalGas:FuelType? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "NaturalGas"), FuelType.bjsFactory)
        }
    }
    
    class var Diesel:FuelType? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "Diesel"), FuelType.bjsFactory)
        }
    }
    
    class var Petrol:FuelType? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "Petrol"), FuelType.bjsFactory)
        }
    }
    
    class var Kerosene:FuelType? {
        get {
            return bjs.getObj(bjs.getProperty(self.bjsClass, "Kerosene"), FuelType.bjsFactory)
        }
    }
    
    var name:String? {
        get {
            return FuelType.bjs.getString(bjsGetProperty("name"))
        }
    }
    
    var cost:Double? {
        get {
            return FuelType.bjs.getFloat(bjsGetProperty("cost"))
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("BeautifulVehicles", "FuelType")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    class func bjsFactory(_ jsObject: JSValue) -> FuelType { FuelType(jsObject) }
}