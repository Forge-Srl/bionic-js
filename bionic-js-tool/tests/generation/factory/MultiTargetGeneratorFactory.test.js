const t = require('../../test-utils')

describe('MultiTargetGeneratorFactory', () => {

    let mockedFactory

    beforeEach(() => {
        const MultiTargetGeneratorFactory = t.requireModule('generation/factory/MultiTargetGeneratorFactory').MultiTargetGeneratorFactory

        class Schema {
            static get schemaName() {
                return 'SchemaName'
            }
        }

        mockedFactory = new MultiTargetGeneratorFactory(new Schema())
        mockedFactory.getGenerator = () => ({path: mockedFactory.generatorPath})
    })

    test('swift, hosting', () => {
        const actualGenerator = mockedFactory.swift.forHosting()
        expect(actualGenerator.path).toBe('../swift/SwiftHostSchemaNameGenerator')
    })

    test('java, wrapping', () => {
        const actualGenerator = mockedFactory.java.forWrapping()
        expect(actualGenerator.path).toBe('../java/JavaWrapperSchemaNameGenerator')
    })
})