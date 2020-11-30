const t = require('../../test-utils')

describe('GeneratorFactory', () => {

    let GeneratorFactory, mockedFactory

    beforeEach(() => {
        GeneratorFactory = t.requireModule('generation/factory/GeneratorFactory').GeneratorFactory

        class Schema {
            static get schemaName() {
                return 'SchemaName'
            }
        }

        mockedFactory = new GeneratorFactory(new Schema())
        t.mockGetter(mockedFactory, 'generator', () => ({
                path: mockedFactory.generatorPath,
                params: mockedFactory.generatorParams,
            }
        ))
    })

    test('generator', () => {
        const ExpectedGeneratorClass = t.requireModule('generation/swift/SwiftMethodGenerator').SwiftMethodGenerator

        const factory = new GeneratorFactory('schema')
        t.mockGetter(factory, 'generatorPath', () => '../swift/SwiftMethodGenerator')
        t.mockGetter(factory, 'generatorName', () => 'SwiftMethodGenerator')
        t.mockGetter(factory, 'generatorParams', () => ['classSchema'])

        const actualGenerator = factory.generator

        expect(actualGenerator).toBeInstanceOf(ExpectedGeneratorClass)
        expect(actualGenerator.schema).toBe('schema')
        expect(actualGenerator.classSchema).toBe('classSchema')
    })

    test('swift', () => {
        const actualGenerator = mockedFactory.swift
        expect(actualGenerator.path).toBe('../swift/SwiftSchemaNameGenerator')
    })

    test('java', () => {
        const actualGenerator = mockedFactory.java
        expect(actualGenerator.path).toBe('../java/JavaSchemaNameGenerator')
    })

    test('javascript', () => {
        const actualGenerator = mockedFactory.javascript
        expect(actualGenerator.path).toBe('../javascript/JavascriptSchemaNameGenerator')
        expect(actualGenerator.path).toBe('../javascript/JavascriptSchemaNameGenerator')
    })

    test('swift, hosting', () => {
        const actualGenerator = mockedFactory.forHosting('param1', 'param2').swift
        expect(actualGenerator.path).toBe('../swift/SwiftHostSchemaNameGenerator')
        expect(actualGenerator.params).toStrictEqual(['param1', 'param2'])
    })

    test('java, hosting', () => {
        const actualGenerator = mockedFactory.forHosting().java
        expect(actualGenerator.path).toBe('../java/JavaHostSchemaNameGenerator')
        expect(actualGenerator.params).toStrictEqual([])
    })

    test('java, wrapping', () => {
        const actualGenerator = mockedFactory.forWrapping('param1', 'param2').java
        expect(actualGenerator.path).toBe('../java/JavaWrapperSchemaNameGenerator')
        expect(actualGenerator.params).toStrictEqual(['param1', 'param2'])
    })

    test('javascript, wrapping', () => {
        const actualGenerator = mockedFactory.forWrapping().javascript
        expect(actualGenerator.path).toBe('../javascript/JavascriptWrapperSchemaNameGenerator')
        expect(actualGenerator.params).toStrictEqual([])
    })
})