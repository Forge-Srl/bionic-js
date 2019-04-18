const t = require('../test-utils')

describe('Class', () => {

    let Class, Constructor, Property, Method, IntType, VoidType

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Constructor = t.requireModule('schema/Constructor')
        Property = t.requireModule('schema/Property')
        Method = t.requireModule('schema/Method')
        IntType = t.requireModule('schema/types/IntType')
        VoidType = t.requireModule('schema/types/VoidType')
    })


    test('getHostGeneratorClass', () => {
        const ExpectedGeneratorClass = t.requireModule('generation/host/swift/SwiftClassGenerator')

        const clazz = new Class()
        const GeneratorClass = clazz.getHostGeneratorClass('swift', 'Swift')

        expect(GeneratorClass).toBe(ExpectedGeneratorClass)
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
                type: {type: 'Int'}, kind: 'get',
            }],
            methods: [{
                name: 'method', description: 'method desc', isStatic: false, isOverriding: false,
                returnType: {type: 'Void'}, parameters: [],
            }],
            superClassName: 'SuperClass', modulePath: '../filePath',
        }
        const clazz = Class.fromObj(classObj)

        const expectedClass = new Class('Class', 'Class desc', [new Constructor('constructor desc', [])],
            [new Property('getter', 'getter desc', false, false, new IntType(), 'get')],
            [new Method('method', 'method desc', false, false, new VoidType(), [])], 'SuperClass', '../filePath')

        expect(clazz).toBeInstanceOf(Class)
        expect(clazz.constructors[0]).toBeInstanceOf(Constructor)
        expect(clazz.properties[0]).toBeInstanceOf(Property)
        expect(clazz.methods[0]).toBeInstanceOf(Method)
        expect(clazz).toEqual(expectedClass)
    })

    test('isValid', () => {
        t.resetModulesCache()

        const Validation = t.mockAndRequireModule('schema/Validation')
        Validation.validateIdentifier.mockReturnValueOnce('isValid')

        Class = t.requireModule('schema/Class')
        const actualClass = new Class('ClassName')

        expect(actualClass.isValid).toBe('isValid')
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })
})