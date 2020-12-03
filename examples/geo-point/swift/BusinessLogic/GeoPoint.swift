import JavaScriptCore
import Bjs

class GeoPoint: BjsObject {
    
    class func getKmDistance(_ point1: GeoPoint?, _ point2: GeoPoint?) -> Double? {
        return bjs.getFloat(bjs.call(self.bjsClass, "getKmDistance", bjs.putObj(point1), bjs.putObj(point2)))
    }
    
    convenience init(_ latitude: Double?, _ longitude: Double?) {
        self.init(GeoPoint.bjsClass, [GeoPoint.bjs.putPrimitive(latitude), GeoPoint.bjs.putPrimitive(longitude)])
    }
    
    var degMinSec:String? {
        get {
            return GeoPoint.bjs.getString(bjsGetProperty("degMinSec"))
        }
    }
    
    var coordinates:String? {
        get {
            return GeoPoint.bjs.getString(bjsGetProperty("coordinates"))
        }
    }
    
    private static var _bjsLocator: BjsLocator = BjsLocator("GeoPoint", "GeoPoint")
    override class var bjsLocator: BjsLocator { _bjsLocator }
    class func bjsFactory(_ jsObject: JSValue) -> GeoPoint { GeoPoint(jsObject) }
}