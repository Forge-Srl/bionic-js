const t = require('../../test-utils')

describe('GeneratorFactory', () => {

    let GeneratorFactory, mockedFactory

    beforeEach(() => {
        GeneratorFactory = t.requireModule('generation/factory/GeneratorFactory')

        class Schema {
            static get schemaName() {
                return 'SchemaName'
            }
        }
        mockedFactory = new GeneratorFactory(new Schema())
        mockedFactory.getGenerator = () => ({path: mockedFactory.generatorPath})
    })

    test('getGenerator', () => {
        const ExpectedGeneratorClass = t.requireModule('generation/swift/SwiftMethodGenerator')

        const factory = new GeneratorFactory('schema')
        t.mockGetter(factory, 'generatorPath', () => '../swift/SwiftMethodGenerator')

        const actualGenerator = factory.getGenerator('classSchema')

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
})