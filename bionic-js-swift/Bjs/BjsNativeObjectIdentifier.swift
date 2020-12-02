import JavaScriptCore

struct BjsNativeObjectIdentifier: Hashable {
    let jsManagedValue: JSManagedValue, typeIdentifier: ObjectIdentifier
    
    init(_ jsValue: JSValue, _ objectType: Any.Type) {
        self.jsManagedValue = JSManagedValue(value: jsValue)
        self.typeIdentifier = ObjectIdentifier(objectType)
    }
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(jsManagedValue.value)
        hasher.combine(typeIdentifier)
    }
}

func ==(lhs: BjsNativeObjectIdentifier, rhs: BjsNativeObjectIdentifier) -> Bool {
    return lhs.jsManagedValue.value != nil &&
        lhs.jsManagedValue.value == rhs.jsManagedValue.value &&
        lhs.typeIdentifier == rhs.typeIdentifier
}
