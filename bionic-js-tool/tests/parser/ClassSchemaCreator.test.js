const t = require('../test-utils')

describe('ClassSchemaCreator', () => {

    let MethodSchemaCreator, ClassSchemaCreator, Class, Method, Constructor, Property, LambdaType

    beforeEach(() => {
        t.resetModulesCache()

        MethodSchemaCreator = t.mockAndRequireModule('parser/MethodSchemaCreator').MethodSchemaCreator
        ClassSchemaCreator = t.requireModule('parser/ClassSchemaCreator').ClassSchemaCreator
        Class = t.requireModule('schema/Class').Class
        Method = t.requireModule('schema/Method').Method
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
    })

    test('name', () => {
        expect(new ClassSchemaCreator({name: 'Class1'}).name).toBe('Class1')
    })

    test('modulePath', () => {
        expect(new ClassSchemaCreator({modulePath: '/modulePath'}).modulePath).toBe('/modulePath')
    })

    test('getSuperclassSchemaStack, no superclass', () => {
        const classSchemaCreator = new ClassSchemaCreator({superclassName: null})
        const superclassSchemaStack = ['schema']
        expect(classSchemaCreator.getSuperclassSchemaStack(null, superclassSchemaStack)).toBe(superclassSchemaStack)
    })

    test('getSuperclassSchemaStack, inheritance cycle', () => {
        const classSchemaCreator = new ClassSchemaCreator({name: 'Class1', superclassName: 'SuperClass1'})

        const superclassSchemaStack = [{name: 'SuperClass1'}]
        expect(() => classSchemaCreator.getSuperclassSchemaStack(null, superclassSchemaStack))
            .toThrow('class "Class1" extends superclass "SuperClass1" but this generates an inheritance cycle (e.g. A extends B, B extends A)')
    })

    test('getSuperclassSchemaStack, superclass not exported', () => {
        const classSchemaCreator = new ClassSchemaCreator({name: 'Class1', superclassName: 'SuperClass1'})

        const classSchemaCreators = new Map()
        expect(() => classSchemaCreator.getSuperclassSchemaStack(classSchemaCreators, []))
            .toThrow('class "Class1" extends a superclass "SuperClass1" that has not been exported')
    })

    test('getSuperclassSchemaStack', () => {
        const classSchemaCreator = new ClassSchemaCreator({name: 'Class1', superclassName: 'SuperClass1'})

        const superclassCreator = {getSchema: t.mockFn(() => 'SuperClassSchema')}
        const classSchemaCreators = new Map([['SuperClass1', superclassCreator]])
        const superclassSchemaStack = ['ClassSchema1', 'ClassSchema2']

        const schemaStack = classSchemaCreator.getSuperclassSchemaStack(classSchemaCreators, superclassSchemaStack)
        expect(schemaStack).toStrictEqual(['SuperClassSchema', 'ClassSchema1', 'ClassSchema2'])
        expect(superclassCreator.getSchema).toBeCalledWith(classSchemaCreators, superclassSchemaStack)
    })

    test('getSchema', () => {
        const constructorExplorer = {name: 'constructor'}
        const methodExplorer = {name: 'method'}
        const getterExplorer1 = {name: 'getter'}
        const getterExplorer2 = {name: 'getter'}

        const classSchemaCreator = new ClassSchemaCreator({
            name: 'Class1',
            description: 'Description',
            superclassName: 'SuperclassName',
            modulePath: '/module/path',
            methodExplorers: [constructorExplorer, methodExplorer, getterExplorer1, getterExplorer2],
        })

        classSchemaCreator.getSuperclassSchemaStack = (classSchemaCreators, superclassSchemaStack) => {
            expect(classSchemaCreators).toBe('classSchemaCreators')
            expect(superclassSchemaStack).toBe('superclassSchemaStack')
            return 'superclassSchemaStack'
        }

        const constructorSchema = new Constructor()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, superclassSchemaStack) => {
            expect(methodExplorers).toStrictEqual([constructorExplorer])
            expect(superclassSchemaStack).toBe('superclassSchemaStack')
            return {schema: constructorSchema}
        })

        const methodSchema = new Method()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, superclassSchemaStack) => {
            expect(methodExplorers).toStrictEqual([methodExplorer])
            expect(superclassSchemaStack).toBe('superclassSchemaStack')
            return {schema: methodSchema}
        })

        const getterSchema = new Property()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, superclassSchemaStack) => {
            expect(methodExplorers).toStrictEqual([getterExplorer1, getterExplorer2])
            expect(superclassSchemaStack).toBe('superclassSchemaStack')
            return {schema: getterSchema}
        })

        const classSchema = classSchemaCreator.getSchema('classSchemaCreators', 'superclassSchemaStack')
        expect(classSchema).toBeInstanceOf(Class)
        expect(classSchema.name).toBe('Class1')
        expect(classSchema.description).toBe('Description')
        expect(classSchema.constructors).toStrictEqual([constructorSchema])
        expect(classSchema.methods).toStrictEqual([methodSchema])
        expect(classSchema.properties).toStrictEqual([getterSchema])
        expect(classSchema.superclassName).toStrictEqual('SuperclassName')
        expect(classSchema.modulePath).toStrictEqual('/module/path')

        expect(classSchemaCreator.getSchema()).toBe(classSchema)
    })

    test('getSchema, error getting schema', () => {
        const constructorExplorer = {name: 'constructor'}

        const classSchemaCreator = new ClassSchemaCreator({
            name: 'Class1',
            modulePath: '/module/path',
            methodExplorers: [constructorExplorer],
        })

        classSchemaCreator.getSuperclassSchemaStack = () => 'superclassSchemaStack'

        MethodSchemaCreator.mockImplementationOnce(() => {
            throw new Error('inner error')
        })

        expect(() => classSchemaCreator.getSchema('classSchemaCreators', 'superclassSchemaStack'))
            .toThrow('extracting schema from class Class1 in module "/module/path"\ninner error')
    })
})