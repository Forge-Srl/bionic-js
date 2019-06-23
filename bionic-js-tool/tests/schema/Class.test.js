const t = require('../test-utils')

describe('Class', () => {

    let Class, Constructor, Property, Method, IntType, VoidType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
    })

    test('schemaName', () => {
        expect(Class.schemaName).toBe('Class')
    })

    test('fromObj', () => {
        const classObj = {
            name: 'Class',
            description: 'Class desc',
            constructors: [{
                description: 'constructor desc', parameters: [],
            }],
            properties: [{
                name: 'getter', description: 'getter desc', isStatic: false, isOverriding: false,
                type: {type: 'Int'}, kinds: ['get'],
            }],
            methods: [{
                name: 'method', description: 'method desc', isStatic: false, isOverriding: false,
                returnType: {type: 'Void'}, parameters: [],
            }],
            superClassName: 'SuperClass', modulePath: '../filePath',
        }
        const clazz = Class.fromObj(classObj)

        const expectedClass = new Class('Class', 'Class desc', [new Constructor('constructor desc', [])],
            [new Property('getter', 'getter desc', false, false, new IntType(), ['get'])],
            [new Method('method', 'method desc', false, false, new VoidType(), [])], 'SuperClass', '../filePath')

        expect(clazz).toBeInstanceOf(Class)
        expect(clazz.constructors[0]).toBeInstanceOf(Constructor)
        expect(clazz.properties[0]).toBeInstanceOf(Property)
        expect(clazz.methods[0]).toBeInstanceOf(Method)
        expect(clazz).toEqual(expectedClass)
    })

    test('isValid', () => {
        t.resetModulesCache()

        const Validation = t.mockAndRequireModule('schema/Validation').Validation
        Validation.validateIdentifier.mockReturnValueOnce('isValid')

        Class = t.requireModule('schema/Class').Class
        const actualClass = new Class('ClassName')

        expect(actualClass.isValid).toBe('isValid')
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })
})