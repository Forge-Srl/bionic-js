module.exports = () => ({
    Array: require('./ArrayType').ArrayType,
    Class: require('./ClassType').ClassType,
    Bool: require('./BoolType').BoolType,
    Date: require('./DateType').DateType,
    Float: require('./FloatType').FloatType,
    Int: require('./IntType').IntType,
    JsClass: require('./JsClassType').JsClassType,
    JsRef: require('./JsRefType').JsRefType,
    Lambda: require('./LambdaType').LambdaType,
    NativeClass: require('./NativeClassType').NativeClassType,
    String: require('./StringType').StringType,
    Void: require('./VoidType').VoidType,
})