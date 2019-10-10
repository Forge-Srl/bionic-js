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

    test('getSchema', () => {
        const classSchemaCreator = new ClassSchemaCreator()

        const moduleCreator1 = {name: 'creator1'}
        const moduleCreator2 = {name: 'creator2'}
        const moduleCreators = [moduleCreator1, moduleCreator2]
        const expectedCreatorsMap = new Map([['creator1', moduleCreator1], ['creator2', moduleCreator2]])

        classSchemaCreator.buildSchema = (moduleCreatorsMap, superclassSchemas) => {
            expect(moduleCreatorsMap).toStrictEqual(expectedCreatorsMap)
            expect(superclassSchemas).toStrictEqual([])
            return {expected: 'schema'}
        }

        const schema = classSchemaCreator.getSchema(moduleCreators)
        expect(schema).toEqual({expected: 'schema'})
        expect(classSchemaCreator.getSchema()).toBe(schema)
    })

    test('buildSchema', () => {
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

        const fakeModuleCreatorsMap = {
            get: superclassName => {
                expect(superclassName).toBe('SuperclassName')
                return {name: 'SuperclassNameFromCreator'}
            },
        }

        classSchemaCreator.buildSuperclassSchemas = (moduleCreatorsMap, currentSuperclassSchemas) => {
            expect(moduleCreatorsMap).toBe(fakeModuleCreatorsMap)
            expect(currentSuperclassSchemas).toBe('currentSuperclassSchemaStack')
            return 'superclassSchemas'
        }

        classSchemaCreator.buildMethodCreatorContext = (moduleCreatorsMap, superclassSchemas) => {
            expect(moduleCreatorsMap).toBe(fakeModuleCreatorsMap)
            expect(superclassSchemas).toBe('superclassSchemas')
            return 'methodCreatorContext'
        }

        const constructorSchema = new Constructor()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, methodCreatorContext) => {
            expect(methodExplorers).toStrictEqual([constructorExplorer])
            expect(methodCreatorContext).toBe('methodCreatorContext')
            return {schema: constructorSchema}
        })

        const methodSchema = new Method()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, methodCreatorContext) => {
            expect(methodExplorers).toStrictEqual([methodExplorer])
            expect(methodCreatorContext).toBe('methodCreatorContext')
            return {schema: methodSchema}
        })

        const getterSchema = new Property()
        MethodSchemaCreator.mockImplementationOnce((methodExplorers, methodCreatorContext) => {
            expect(methodExplorers).toStrictEqual([getterExplorer1, getterExplorer2])
            expect(methodCreatorContext).toBe('methodCreatorContext')
            return {schema: getterSchema}
        })

        const classSchema = classSchemaCreator.buildSchema(fakeModuleCreatorsMap, 'currentSuperclassSchemaStack')
        expect(classSchema).toBeInstanceOf(Class)
        expect(classSchema.name).toBe('Class1')
        expect(classSchema.description).toBe('Description')
        expect(classSchema.constructors).toStrictEqual([constructorSchema])
        expect(classSchema.methods).toStrictEqual([methodSchema])
        expect(classSchema.properties).toStrictEqual([getterSchema])
        expect(classSchema.superclassName).toStrictEqual('SuperclassNameFromCreator')
        expect(classSchema.modulePath).toStrictEqual('/module/path')

        expect(classSchemaCreator.buildSchema()).toBe(classSchema)
    })

    test('buildSchema, superclass not exported', () => {
        const classSchemaCreator = new ClassSchemaCreator({
            name: 'Class1',
            description: 'Description',
            superclassName: 'SuperclassName',
            modulePath: '/module/path',
            methodExplorers: [],
        })

        const fakeModuleCreatorsMap = {
            get: superclassName => {
                expect(superclassName).toBe('SuperclassName')
                return undefined
            },
        }

        classSchemaCreator.buildSuperclassSchemas = (moduleCreatorsMap, currentSuperclassSchemas) => {
            expect(moduleCreatorsMap).toBe(fakeModuleCreatorsMap)
            expect(currentSuperclassSchemas).toBe('currentSuperclassSchemaStack')
            return 'superclassSchemas'
        }

        classSchemaCreator.buildMethodCreatorContext = (moduleCreatorsMap, superclassSchemas) => {
            expect(moduleCreatorsMap).toBe(fakeModuleCreatorsMap)
            expect(superclassSchemas).toBe('superclassSchemas')
            return 'methodCreatorContext'
        }

        const classSchema = classSchemaCreator.buildSchema(fakeModuleCreatorsMap, 'currentSuperclassSchemaStack')
        expect(classSchema.name).toBe('Class1')
        expect(classSchema.superclassName).toBe(null)
    })

    test('buildSchema, error getting schema', () => {
        const constructorExplorer = {name: 'constructor'}

        const classSchemaCreator = new ClassSchemaCreator({
            name: 'Class1',
            modulePath: '/module/path',
            methodExplorers: [constructorExplorer],
        })

        classSchemaCreator.buildSuperclassSchemas = () => {
            throw new Error('inner error')
        }

        expect(() => classSchemaCreator.buildSchema())
            .toThrow('extracting schema from class Class1 in module "/module/path"\ninner error')
    })

    test('buildSuperclassSchemas, no superclass', () => {
        const classSchemaCreator = new ClassSchemaCreator({superclassName: null})
        const currentSuperclassSchemas = ['schema']

        const moduleCreatorsMap = {
            get: superclassName => {
                expect(superclassName).toBe(null)
                return undefined
            },
        }
        expect(classSchemaCreator.buildSuperclassSchemas(moduleCreatorsMap, currentSuperclassSchemas)).toBe(currentSuperclassSchemas)
    })

    test('buildSuperclassSchemas, inheritance cycle', () => {
        const classSchemaCreator = new ClassSchemaCreator({name: 'Class1', superclassName: 'SuperClass1'})
        const superclassSchemaStack = [{name: 'SuperClass1'}]

        const moduleCreatorsMap = {get: () => 'superclassSchemaCreator'}
        expect(() => classSchemaCreator.buildSuperclassSchemas(moduleCreatorsMap, superclassSchemaStack))
            .toThrow('class "Class1" extends superclass "SuperClass1" but this generates an inheritance cycle (e.g. A extends B, B extends A)')
    })

    test('buildSuperclassSchemas', () => {
        const classSchemaCreator = new ClassSchemaCreator({name: 'Class1', superclassName: 'SuperClass1'})

        const currentSuperclassSchemas = ['ClassSchema1', 'ClassSchema2']
        const superclassModuleCreator = {buildSchema: t.mockFn(() => 'SuperClassSchema')}
        const moduleCreatorsMap = new Map([['SuperClass1', superclassModuleCreator]])

        const schemaStack = classSchemaCreator.buildSuperclassSchemas(moduleCreatorsMap, currentSuperclassSchemas)
        expect(schemaStack).toStrictEqual(['SuperClassSchema', 'ClassSchema1', 'ClassSchema2'])
        expect(superclassModuleCreator.buildSchema).toBeCalledWith(moduleCreatorsMap, currentSuperclassSchemas)
    })

    test('buildMethodCreatorContext', () => {
        const classSchemaCreator = new ClassSchemaCreator()

        const moduleCreatorsMap = new Map([
            ['m1', {isNative: true, name: 'module1'}],
            ['m2', {isNative: false, name: 'module2'}],
        ])

        const superclassSchemas = [
            {methods: [{name: 'method1'}, {name: 'method2'}], properties: [{name: 'property1'}, {name: 'property2'}]},
            {methods: [{name: 'method2'}, {name: 'method3'}], properties: [{name: 'property2'}, {name: 'property3'}]},
        ]

        const context = classSchemaCreator.buildMethodCreatorContext(moduleCreatorsMap, superclassSchemas)

        expect(context.superclassMethodNames).toStrictEqual(new Set(['method1', 'method2', 'method3']))
        expect(context.superclassPropertyNames).toStrictEqual(new Set(['property1', 'property2', 'property3']))
        expect(context.jsModuleNames).toStrictEqual(new Set(['module2']))
        expect(context.nativeModuleNames).toStrictEqual(new Set(['module1']))
    })
})