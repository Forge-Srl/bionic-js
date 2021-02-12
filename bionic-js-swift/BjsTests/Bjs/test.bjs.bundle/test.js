const moduleLoaders = new Map()

moduleLoaders.set('BjsNativeObject', () => {
    
    class BjsNativeObject {
        constructor(...params) {
            this.constructor.bjsNative.bjsBind(this, ...params)
        }
    }
    return {BjsNativeObject}
})

moduleLoaders.set('ToyClass1', () => {
    
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
            const isoDate = date == null ? null : date.toISOString()
            const anyLog = any == null ? null : any.log
            const bjsObjLog = bjsObj == null ? null : bjsObj.log
            const arrayRet = array == null ? null : `[${array.join()}]`
            const lambdaRet = lambda == null ? null : lambda()
            ToyClass1.log = `called paramsFunc with params: ${bool}, ${isoDate}, ${float}, ${int}, ${string}, ${anyLog}, ${bjsObjLog}, ${arrayRet}, ${lambdaRet}`
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
    return {ToyClass1}
})

moduleLoaders.set('ToyClass2', () => {
    
    const {ToyClass1} = require('ToyClass1')
    
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
            const isoDate = date == null ? null : date.toISOString()
            const anyLog = any == null ? null : any.log
            const bjsObjLog = bjsObj == null ? null : bjsObj.log
            const arrayRet = array == null ? null : `[${array.join()}]`
            const lambdaRet = lambda == null ? null : lambda()
            this.log = `called paramsFunc with params: ${bool}, ${isoDate}, ${float}, ${int}, ${string}, ${anyLog}, ${bjsObjLog}, ${arrayRet}, ${lambdaRet}`
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
    return {ToyClass2}
})


moduleLoaders.set('ToyComponent1', () => {
    
    const {BjsNativeObject} = require('BjsNativeObject')
    const {bjsNative} = bjsNativeRequire('ToyComponent1')
    
    class ToyComponent1 extends BjsNativeObject {
        
        static get bjsNative() {
            return bjsNative
        }
        
        // @bionic Float
        static get pi() {
            return bjsNative.bjsStaticGet_pi()
        }
        
        // @bionic (Int, Int) => Int
        static sum(number1, number2) {
            return bjsNative.bjsStatic_sum(number1, number2)
        }
        
        // @bionic Int
        get number1() {
            return bjsNative.bjsGet_number1(this)
        }
        
        // @bionic Int
        set number1(newValue) {
            bjsNative.bjsSet_number1(this, newValue)
        }
        
        // @bionic Int
        get number2() {
            return bjsNative.bjsGet_number2(this)
        }
        
        // @bionic Int
        set number2(newValue) {
            bjsNative.bjsSet_number2(this, newValue)
        }
        
        // @bionic (Int) => Int
        getSum(offset) {
            return bjsNative.bjs_getSum(this, offset)
        }
        
        // @bionic (ToyComponent1) => Int
        getToySum(toyComponent1) {
            return bjsNative.bjs_getToySum(this, toyComponent1)
        }
    }
    return {ToyComponent1}
})

moduleLoaders.set('UserOfToyComponent1', () => {
    
    const {ToyComponent1} = require('ToyComponent1')
    
    class UserOfToyComponent1 {
        
        // @bionic ToyComponent1
        static get lastToy() {
            return this._lastToy
        }
        
        // @bionic ToyComponent1
        static set lastToy(lastToy) {
            this._lastToy = lastToy
        }
                
        // @bionic (Int, Int, Int) => Void
        static add(offset, int1, int2) {
            const toy = new ToyComponent1(int1, int2, 1)
            return toy.getSum(offset)
        }
        
        // @bionic (Int, Int) => ToyComponent1
        static getToy(int1, int2) {
            this.lastToy = new ToyComponent1(`${int1}`, `${int2}`, 2)
            return this.lastToy
        }
        
        // @bionic (ToyComponent1, ToyComponent1) => Int
        static getSum(toy1, toy2) {
            return toy1.getToySum(toy2)
        }
    }
    return {UserOfToyComponent1}
})

const moduleCache = new Map()

function require(moduleName) {
    if (!moduleCache.has(moduleName)) {
        const moduleLoader = moduleLoaders.get(moduleName)
        moduleCache.set(moduleName, moduleLoader ? moduleLoader() : undefined)
    }
    return moduleCache.get(moduleName)
}

bjsSetModuleLoader(require)
