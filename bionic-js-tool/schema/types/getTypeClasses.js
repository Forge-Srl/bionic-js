module.exports = () => ({
    Any: require('./AnyType').AnyType,
    Array: require('./ArrayType').ArrayType,
    Bool: require('./BoolType').BoolType,
    Date: require('./DateType').DateType,
    Float: require('./FloatType').FloatType,
    Int: require('./IntType').IntType,
    Lambda: require('./LambdaType').LambdaType,
    NativeObject: require('./NativeObjectType').NativeObjectType,
    Object: require('./ObjectType').ObjectType,
    String: require('./StringType').StringType,
    Void: require('./VoidType').VoidType,
    WrappedObject: require('./WrappedObjectType').WrappedObjectType,
})