import JavaScriptCore

class ToyComponent1BjsWrapper: BjsNativeWrapper {
    
    class func bjsStaticGet_pi() -> @convention(block) () -> JSValue {
        return {
            return bjs.putPrimitive(ToyComponent1.pi)
        }
    }
    
    class func bjsStatic_sum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return bjs.putPrimitive(ToyComponent1.sum(bjs.getInt($0), bjs.getInt($1)))
        }
    }
    
    class func bjsGet_number1() -> @convention(block) (JSValue) -> JSValue {
        return {
            return bjs.putPrimitive(bjs.getWrapped($0, ToyComponent1.self)?.number1)
        }
    }
    
    class func bjsSet_number1() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = bjs.getWrapped($0, ToyComponent1.self)!.number1 = bjs.getInt($1)
        }
    }
    
    class func bjsGet_number2() -> @convention(block) (JSValue) -> JSValue {
        return {
            return bjs.putPrimitive(bjs.getWrapped($0, ToyComponent1.self)?.number2)
        }
    }
    
    class func bjsSet_number2() -> @convention(block) (JSValue, JSValue) -> Void {
        return {
            _ = bjs.getWrapped($0, ToyComponent1.self)?.number2 = bjs.getInt($1)
        }
    }
    
    class func bjs_getSum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return bjs.putPrimitive(bjs.getWrapped($0, ToyComponent1.self)?.getSum(bjs.getInt($1)))
        }
    }
    
    class func bjs_getToySum() -> @convention(block) (JSValue, JSValue) -> JSValue {
        return {
            return bjs.putPrimitive(bjs.getWrapped($0, ToyComponent1.self)?.getToySum(bjs.getWrapped($1, ToyComponent1.self)))
        }
    }
    
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
            bjs.bindNative(bjs.getBound($1, ToyComponent1.self) ?? ToyComponent1(bjs.getString($1), bjs.getString($2), bjs.getInt($3)), $0)
        } as @convention(block) (JSValue, JSValue, JSValue, JSValue) -> Void)
    }
    
    static var _bjsLocator = BjsLocator("TestProject", "ToyComponent1")
    override class var bjsLocator: BjsLocator { _bjsLocator }
}
