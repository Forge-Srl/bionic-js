import JavaScriptCore

class ToyWrapped1Wrapper: BjsNativeWrapper {
    
    override class var name: String { return "ToyWrapped1" }
    override class var wrapperPath: String { return "/_bundle_/test/src/ToyWrapped1" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {
        _ = nativeExports
            .exportBindFunction(bjsBind())
            .exportFunction("getSum", getSum())
            .exportFunction("getToySum", getToySum())
    }
    
    class func bjsBind() -> @convention(block) (JSValue, JSValue, JSValue) -> Void {
        return { jsObj, number1, number2 in
            Bjs.get.bindNative(
                Bjs.get.getBound(number1, ToyWrapped1.self) ??
                    ToyWrapped1(Bjs.get.getString(number1), Bjs.get.getString(number2)), jsObj)
        }
    }
    
    class func getSum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return { jsObj, offset in
            return Bjs.get.putPrimitive(
                Bjs.get.getWrapped(jsObj, ToyWrapped1.self)?
                    .getSum(Bjs.get.getInt(offset)))
        }
    }
    
    class func getToySum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return { jsObj, toy in
            return Bjs.get.putPrimitive(
                Bjs.get.getWrapped(jsObj, ToyWrapped1.self)?
                    .getToySum(Bjs.get.getWrapped(toy, ToyWrapped1.self))
            )
        }
    }
}
