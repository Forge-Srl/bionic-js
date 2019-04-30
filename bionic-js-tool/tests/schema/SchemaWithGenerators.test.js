const t = require('../test-utils')

describe('SchemaWithGenerators', () => {

    let SchemaWithGenerators

    beforeEach(() => {
        SchemaWithGenerators = t.requireModule('schema/SchemaWithGenerators')
    })

    test('getGeneratorClass', () => {
        class Generator extends SchemaWithGenerators {
            static get schemaName() {
                return 'Class'
            }
        }

        const ExpectedGeneratorClass = t.requireModule('generation/swift/classParts/SwiftClassGenerator')

        const generator = new Generator()
        const GeneratorClass = generator.getGeneratorClass('Swift')

        expect(GeneratorClass).toBe(ExpectedGeneratorClass)
    })

    class Schema {
        constructor(...params) {
            Object.assign(this, {...params})
        }
    }

    test('getSwiftGenerator', () => {
        const schema = new SchemaWithGenerators()
        schema.getGeneratorClass = language => {
            expect(language).toBe('Swift')
            return Schema
        }

        const generator = schema.getSwiftGenerator('param1', 'param2', 'param3')

        expect(generator).toBeInstanceOf(Schema)
        expect(generator['0']).toBe(schema)
        expect(generator['1']).toBe('param1')
        expect(generator['2']).toBe('param2')
        expect(generator['3']).toBe('param3')
    })

    test('getJavaGenerator', () => {
        const schema = new SchemaWithGenerators()
        schema.getGeneratorClass = language => {
            expect(language).toBe('Java')
            return Schema
        }

        const generator = schema.getJavaGenerator('param1', 'param2', 'param3')

        expect(generator).toBeInstanceOf(Schema)
        expect(generator['0']).toBe(schema)
        expect(generator['1']).toBe('param1')
        expect(generator['2']).toBe('param2')
        expect(generator['3']).toBe('param3')
    })
})