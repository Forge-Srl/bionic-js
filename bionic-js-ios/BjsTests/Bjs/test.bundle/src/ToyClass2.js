const {ToyClass1} = require('./ToyClass1')

class ToyClass2 extends ToyClass1 {
    
    // @bionic get set nativeAutoProp String
    // @bionic get set anyAutoProp Any
    // @bionic get set bjsObjAutoProp ToyClass1
    // @bionic get set lambdaAutoProp (String) => String
    // @bionic get set nativeArrayAutoProp (Array<Array<Array<String>>>)
    // @bionic get set bjsObjArrayAutoProp (Array<Array<Array<ToyClass1>>>)
    // @bionic get set anyArrayAutoProp (Array<Array<Array<Any>>>)
    // @bionic get set lambdaArrayAutoProp (Array<Array<Array<((String) => String))>>>)
    
    // @bionic (Bool)
    constructor(bool) {
        super()
        if (!bool)
            this.log = 'called constructor without params'
        else
            this.log = `called constructor with params: ${bool}`
    }
    
    // @bionic String
    get prop() {
        return this._prop || "1984!"
    }
    
    // @bionic String
    set prop(value) {
        this._prop = value
    }
    
    // @bionic
    voidFunc() {
        this.log = 'called voidFunc'
    }
    
    // @bionic (Bool, Date, Float, Int, String, Any, ToyClass1, () => String)
    paramsFunc(bool, date, float, int, string, any, bjsObj, array, lambda) {
        const anyLog = any == null ? null : any.log
        const bjsObjLog = bjsObj == null ? null : bjsObj.log
        const arrayRet = array == null ? null : `[${array.join()}]`
        const lambdaRet = lambda == null ? null : lambda()
        this.log = `called paramsFunc with params: ${bool}, ${date}, ${float}, ${int}, ${string}, ${anyLog}, ${bjsObjLog}, ${arrayRet}, ${lambdaRet}`
    }
    
    retValueFunc() {
        this.log = 'called retValueFunc'
        return this.value
    }
    
    // @bionic (()) => ()
    lambdaVoidFunc(lambda) {
        this.log = 'called lambdaVoidFunc'
        return !lambda ? null: () => {
            this.log = 'calling lambda'
            lambda()
        }
    }
    
    // @bionic ((Int, String, Any, ToyClass2) => String)
    lambdaWithParamsFunc(lambda) {
        this.log = 'called lambdaWithParamsFunc'
        const lambdaResult = lambda(1984, null, {log:"hello 84"}, {log:"hello 84"})
        this.log = `called lambda with result: ${lambdaResult}`
    }
    
    // @bionic () => (Int, String, Any, ToyClass2) => String
    returningLambdaWithParamsFunc() {
        this.log = 'called returningLambdaWithParamsFunc'
        return (int, any, bjsObj, array) => {
            const anyLog = any == null ? null : any.log
            const bjsObjLog = bjsObj == null ? null : bjsObj.log
            const arrayRet = array == null ? null : `[${array.join()}]`
            this.log = `called returned lambda with params: ${int}, ${anyLog}, ${bjsObjLog}, ${arrayRet}`
            return 'lambda returning value'
        }
    }
}

module.exports = {ToyClass2}
