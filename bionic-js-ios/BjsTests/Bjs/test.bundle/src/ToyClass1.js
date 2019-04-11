class ToyClass1 {
    
    // @bionic static get set nativeAutoProp String
    // @bionic static get set anyAutoProp Any
    // @bionic static get set bjsObjAutoProp ToyClass1
    // @bionic static get set lambdaAutoProp (String) => String
    // @bionic static get set nativeArrayAutoProp (Array<Array<Array<String>>>)
    // @bionic static get set bjsObjArrayAutoProp (Array<Array<Array<ToyClass1>>>)
    // @bionic static get set anyArrayAutoProp (Array<Array<Array<Any>>>)
    // @bionic static get set lambdaArrayAutoProp (Array<Array<Array<((String) => String))>>>)
    
    // @bionic constructor ()
    
    // @bionic String
    static get prop() {
        return ToyClass1._prop || "1984!"
    }
    
    // @bionic String
    static set prop(value) {
        ToyClass1._prop = value
    }
    
    // @bionic
    static voidFunc() {
        ToyClass1.log = 'called voidFunc'
    }
    
    // @bionic (Bool, Date, Float, Int, String, Any, ToyClass1, () => String)
    static paramsFunc(bool, date, float, int, string, any, bjsObj, array, lambda) {
        const anyLog = any == null ? null : any.log
        const bjsObjLog = bjsObj == null ? null : bjsObj.log
        const arrayRet = array == null ? null : `[${array.join()}]`
        const lambdaRet = lambda == null ? null : lambda()
        ToyClass1.log = `called paramsFunc with params: ${bool}, ${date}, ${float}, ${int}, ${string}, ${anyLog}, ${bjsObjLog}, ${arrayRet}, ${lambdaRet}`
    }
    
    static retValueFunc() {
        ToyClass1.log = 'called retValueFunc'
        return ToyClass1.value
    }
    
    // @bionic (()) => ()
    static lambdaVoidFunc(lambda) {
        ToyClass1.log = 'called lambdaVoidFunc'
        return !lambda ? null: () => {
            ToyClass1.log = 'calling lambda'
            lambda()
        }
    }
    
    // @bionic ((Int, String, Any, ToyClass1) => String)
    static lambdaWithParamsFunc(lambda) {
        ToyClass1.log = 'called lambdaWithParamsFunc'
        const lambdaResult = lambda(1984, null, {log:"hello 84"}, {log:"hello 84"})
        ToyClass1.log = `called lambda with result: ${lambdaResult}`
    }
    
    // @bionic () => (Int, String, Any, ToyClass1) => String
    static returningLambdaWithParamsFunc() {
        ToyClass1.log = 'called returningLambdaWithParamsFunc'
        return (int, any, bjsObj, array) => {
            const anyLog = any == null ? null : any.log
            const bjsObjLog = bjsObj == null ? null : bjsObj.log
            const arrayRet = array == null ? null : `[${array.join()}]`
            ToyClass1.log = `called returned lambda with params: ${int}, ${anyLog}, ${bjsObjLog}, ${arrayRet}`
            return 'lambda returning value'
        }
    }
    
    
    static setValue(value) {
        ToyClass1.value = eval(value)
    }
    
    setValue(value) {
        this.value = eval(value)
    }
}

module.exports = ToyClass1
