import JavaScriptCore

class ToyComponent1Wrapper: BjsNativeWrapper {
    
    override class var name: String { return "ToyComponent1" }
    override class var wrapperPath: String { return "/_bundle_/test/src/ToyComponent1" }
    
    override class func bjsExportFunctions(_ nativeExports: BjsNativeExports) -> BjsNativeExports {
        return nativeExports
            .exportFunction("bjsStaticGet_pi", bjsStaticGet_pi())
            .exportFunction("bjsStatic_sum", bjsStatic_sum())
            .exportFunction("bjsGet_number1", bjsGet_number1())
            .exportFunction("bjsSet_number1", bjsSet_number1())
            .exportFunction("bjsGet_number2", bjsGet_number2())
            .exportFunction("bjsSet_number2", bjsSet_number2())
            .exportFunction("bjs_getSum", bjs_getSum())
            .exportFunction("bjs_getToySum", bjs_getToySum())
    }
    
    override class func bjsBind(_ nativeExports: BjsNativeExports) {
        _ = nativeExports.exportBindFunction({
            Bjs.get.bindNative(Bjs.get.getBound($1, ToyComponent1.self) ?? ToyComponent1(Bjs.get.getString($1), Bjs.get.getString($2)), $0)
        } as @convention(block) (JSValue, JSValue, JSValue) -> Void)
    }
    
    class func bjsStaticGet_pi() -> @convention(block) () -> JSValue {
        return {
            return Bjs.get.putPrimitive(ToyComponent1.pi)
        }
    }
    
    class func bjsStatic_sum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(ToyComponent1.sum(Bjs.get.getInt($0), Bjs.get.getInt($1)))
        }
    }
    
    class func bjsGet_number1() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyComponent1.self)?.number1)
        }
    }
    
    class func bjsSet_number1() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, ToyComponent1.self)!.number1 = Bjs.get.getInt($1)
        }
    }
    
    class func bjsGet_number2() -> @convention(block) (JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyComponent1.self)?.number2)
        }
    }
    
    class func bjsSet_number2() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = Bjs.get.getWrapped($0, ToyComponent1.self)?.number2 = Bjs.get.getInt($1)
        }
    }
    
    class func bjs_getSum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyComponent1.self)?.getSum(Bjs.get.getInt($1)))
        }
    }
    
    class func bjs_getToySum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return Bjs.get.putPrimitive(Bjs.get.getWrapped($0, ToyComponent1.self)?.getToySum(Bjs.get.getWrapped($1, ToyComponent1.self)))
        }
    }
}
