const t = require('../test-utils')

describe('MethodSchemaCreator', () => {

    let MethodSchemaCreator, Method, Constructor, Property, LambdaType

    beforeEach(() => {
        MethodSchemaCreator = t.requireModule('parser/MethodSchemaCreator').MethodSchemaCreator
        Method = t.requireModule('schema/Method').Method
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    test('name', () => {
        expect(new MethodSchemaCreator([{name: 'method1'}, {name: 'method2'}]).name).toBe('method1')
    })

    test('description', () => {
        expect(new MethodSchemaCreator([{description: undefined}, {description: 'desc'}]).description).toBe('desc')
    })

    test('kinds, only getter', () => {
        const methodSchemaCreator = new MethodSchemaCreator([{kinds: ['get']}, {kinds: ['get']}])
        const kinds = methodSchemaCreator.kinds

        expect(kinds.size).toBe(1)
        expect(kinds.has('get')).toBe(true)
        expect(methodSchemaCreator.kinds).toBe(kinds)
    })

    test('kinds, getter and setter', () => {
        const kinds = new MethodSchemaCreator([{kinds: ['set']}, {kinds: ['set', 'get']}]).kinds

        expect(kinds.size).toBe(2)
        expect(kinds.has('get')).toBe(true)
        expect(kinds.has('set')).toBe(true)
    })

    test('kinds, property and method with same name', () => {
        const expectedError = '"property1" cannot be at the same time a method name and getter/setter name'

        expect(() => new MethodSchemaCreator([{name: 'property1', kinds: ['get']}, {kinds: ['method']}]).kinds)
            .toThrow(expectedError)
        expect(() => new MethodSchemaCreator([{name: 'property1', kinds: ['set']}, {kinds: ['method']}]).kinds)
            .toThrow(expectedError)
    })

    test('kinds, "constructor" as a name', () => {
        const expectedError = '"constructor" cannot be used as a name in a method/getter/setter annotation'

        expect(() => new MethodSchemaCreator([{name: 'constructor', kinds: ['get']}]).kinds).toThrow(expectedError)
        expect(() => new MethodSchemaCreator([{name: 'constructor', kinds: ['set']}]).kinds).toThrow(expectedError)
        expect(() => new MethodSchemaCreator([{name: 'constructor', kinds: ['method']}]).kinds).toThrow(expectedError)
    })

    test('isStatic, static', () => {
        const methodSchemaCreator = new MethodSchemaCreator([{isStatic: true}, {isStatic: true}])
        const isStatic = methodSchemaCreator.isStatic

        expect(isStatic).toBe(true)

        methodSchemaCreator.methodExplorers = null
        expect(methodSchemaCreator.isStatic).toBe(isStatic)
    })

    test('isStatic, non static', () => {
        expect(new MethodSchemaCreator([{isStatic: false}, {isStatic: false}]).isStatic).toBe(false)
    })

    test('isStatic, static and non static in the same class', () => {
        expect(() => new MethodSchemaCreator([{name: 'method1', isStatic: true}, {isStatic: false}]).isStatic)
            .toThrow('"method1" cannot be static and non-static in the same class')
    })

    test('type, only one type', () => {
        const type1 = {isEqualTo: () => true}

        const methodSchemaCreator = new MethodSchemaCreator([{type: undefined}, {type: type1}])
        const type = methodSchemaCreator.type

        expect(type).toBe(type1)
        expect(methodSchemaCreator.type).toBe(type)
    })

    test('type, same type repeated', () => {
        const type1 = {isEqualTo: () => true}
        expect(new MethodSchemaCreator([{type: type1}, {type: type1}]).type).toBe(type1)
    })

    test('type, different types', () => {
        const type1 = {isEqualTo: () => true}
        const type2 = {isEqualTo: () => false}
        expect(() => new MethodSchemaCreator([{name: 'method1', type: type1}, {type: type2}]).type)
            .toThrow('"method1" is annotated multiple times with different types')
    })

    test('methodSignature', () => {
        const methodSchemaCreator = new MethodSchemaCreator()
        const type = new LambdaType()
        t.mockGetter(methodSchemaCreator, 'type', () => type)

        const methodSignature = methodSchemaCreator.methodSignature

        expect(methodSignature).toBe(type)
        expect(methodSchemaCreator.methodSignature).toBe(methodSignature)
    })

    test('methodSignature, not a lambda type', () => {
        const methodSchemaCreator = new MethodSchemaCreator([{name: 'method1'}])
        t.mockGetter(methodSchemaCreator, 'type', () => ({}))

        expect(() => methodSchemaCreator.methodSignature).toThrow('method "method1" annotation has not a lambda type definition')
    })

    test('constructorSchema', () => {
        const schemaCreator = new MethodSchemaCreator()
        t.mockGetter(schemaCreator, 'description', () => 'description')
        t.mockGetter(schemaCreator, 'methodSignature', () => ({parameters: 'parameters'}))

        expect(schemaCreator.constructorSchema).toStrictEqual(new Constructor('description', 'parameters'))
    })

    test('methodSchema', () => {
        const schemaCreator = new MethodSchemaCreator(null, [{methods: [{name: 'method1', isStatic: false}]}])
        t.mockGetter(schemaCreator, 'name', () => 'method1')
        t.mockGetter(schemaCreator, 'description', () => 'description')
        t.mockGetter(schemaCreator, 'isStatic', () => true)
        t.mockGetter(schemaCreator, 'methodSignature', () => ({returnType: 'returnType', parameters: 'parameters'}))

        expect(schemaCreator.methodSchema).toStrictEqual(new Method('method1', 'description', true, false,
            'returnType', 'parameters'))
    })

    test('methodSchema, another method in hierarchy', () => {
        const schemaCreator = new MethodSchemaCreator(null, [{methods: [{name: 'method1', isStatic: true}]}])
        t.mockGetter(schemaCreator, 'name', () => 'method1')
        t.mockGetter(schemaCreator, 'description', () => 'description')
        t.mockGetter(schemaCreator, 'isStatic', () => true)
        t.mockGetter(schemaCreator, 'methodSignature', () => ({returnType: 'returnType', parameters: 'parameters'}))

        expect(() => schemaCreator.methodSchema).toThrow('method "method1" was already exported in superclass')
    })

    test('propertySchema', () => {
        const schemaCreator = new MethodSchemaCreator(null, [{properties: [{name: 'property1', isStatic: false}]}])
        t.mockGetter(schemaCreator, 'name', () => 'property1')
        t.mockGetter(schemaCreator, 'description', () => 'description')
        t.mockGetter(schemaCreator, 'isStatic', () => true)
        t.mockGetter(schemaCreator, 'type', () => 'type')
        t.mockGetter(schemaCreator, 'kinds', () => ['kind'])

        expect(schemaCreator.propertySchema).toStrictEqual(new Property('property1', 'description', true, false,
            'type', ['kind']))
    })

    test('propertySchema, another property in hierarchy', () => {
        const schemaCreator = new MethodSchemaCreator(null, [{properties: [{name: 'property1', isStatic: true}]}])
        t.mockGetter(schemaCreator, 'name', () => 'property1')
        t.mockGetter(schemaCreator, 'description', () => 'description')
        t.mockGetter(schemaCreator, 'isStatic', () => true)
        t.mockGetter(schemaCreator, 'type', () => 'type')
        t.mockGetter(schemaCreator, 'kinds', () => ['kind'])

        expect(() => schemaCreator.propertySchema).toThrow('property "property1" was already exported in superclass')
    })

    test('schema, constructor', () => {
        const schemaCreator = new MethodSchemaCreator()
        t.mockGetter(schemaCreator, 'kinds', () => new Set(['constructor']))
        t.mockGetter(schemaCreator, 'constructorSchema', () => 'constructorSchema')

        expect(schemaCreator.schema).toBe('constructorSchema')
    })

    test('method, constructor', () => {
        const schemaCreator = new MethodSchemaCreator()
        t.mockGetter(schemaCreator, 'kinds', () => new Set(['method']))
        t.mockGetter(schemaCreator, 'methodSchema', () => 'methodSchema')

        expect(schemaCreator.schema).toBe('methodSchema')
    })

    test('propertySchema, getter', () => {
        const schemaCreator = new MethodSchemaCreator()
        t.mockGetter(schemaCreator, 'kinds', () => new Set(['get']))
        t.mockGetter(schemaCreator, 'propertySchema', () => 'propertySchema')

        expect(schemaCreator.schema).toBe('propertySchema')
    })

    test('propertySchema, setter', () => {
        const schemaCreator = new MethodSchemaCreator()
        t.mockGetter(schemaCreator, 'kinds', () => new Set(['set']))
        t.mockGetter(schemaCreator, 'propertySchema', () => 'propertySchema')

        expect(schemaCreator.schema).toBe('propertySchema')
    })
})