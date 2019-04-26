module.exports = () => ({
    Any: require('./AnyType'),
    Array: require('./ArrayType'),
    Bool: require('./BoolType'),
    Date: require('./DateType'),
    Float: require('./FloatType'),
    Int: require('./IntType'),
    Lambda: require('./LambdaType'),
    NativeObject: require('./NativeObjectType'),
    Object: require('./ObjectType'),
    String: require('./StringType'),
    Void: require('./VoidType'),
    WrappedObject: require('./WrappedObjectType'),
})