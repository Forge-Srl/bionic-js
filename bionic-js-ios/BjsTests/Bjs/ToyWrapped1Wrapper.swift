import JavaScriptCore

class ToyWrapped1Wrapper: BjsNativeWrapper {
    
    override class var name: String { return "ToyWrapped1" }
    override class var wrapperPath: String { return "/_bundle_/test/src/ToyWrapped1" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) {
        _ = nativeExports
            .exportFunction("bjsStaticGet_pi", bjsStaticGet_pi())
            .exportFunction("bjsStatic_sum", bjsStatic_sum())
            .exportBindFunction(bjsBind())
            .exportFunction("bjsGet_number1", bjsGet_number1())
            .exportFunction("bjsSet_number1", bjsSet_number1())
            .exportFunction("bjsGet_number2", bjsGet_number2())
            .exportFunction("bjsSet_number2", bjsSet_number2())
            .exportFunction("bjs_getSum", bjs_getSum())
            .exportFunction("bjs_getToySum", bjs_getToySum())
    }
    
    class func bjsStaticGet_pi() -> @convention(block) () -> JSValue {
        return {
            return Bjs.get.putPrimitive(ToyWrapped1.pi)
        }
    }
    
    class func bjsStatic_sum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(ToyWrapped1.sum(Bjs.get.getInt($0), Bjs.get.getInt($1)))
        }
    }
    
    class func bjsBind() -> @convention(block) (JSValue, JSValue, JSValue) -> Void {
        return {
            Bjs.get.bindNative(Bjs.get.getBound($1, ToyWrapped1.self) ?? ToyWrapped1(Bjs.get.getString($1), Bjs.get.getString($2)), $0)
        }
    }
    
    class func bjsGet_number1() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyWrapped1.self)?.number1)
        }
    }
    
    class func bjsSet_number1() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, ToyWrapped1.self)?.number1 = Bjs.get.getInt($1)
        }
    }
    
    class func bjsGet_number2() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyWrapped1.self)?.number2)
        }
    }
    
    class func bjsSet_number2() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, ToyWrapped1.self)?.number2 = Bjs.get.getInt($1)
        }
    }
    
    class func bjs_getSum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyWrapped1.self)?.getSum(Bjs.get.getInt($1)))
        }
    }
    
    class func bjs_getToySum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyWrapped1.self)?.getToySum(Bjs.get.getWrapped($1, ToyWrapped1.self)))
        }
    }
}
