const t = require('../../test-utils')

describe('TypeGeneratorFactory', () => {

    let mockedFactory

    beforeEach(() => {
        const TypeGeneratorFactory = t.requireModule('generation/factory/TypeGeneratorFactory').TypeGeneratorFactory

        class Schema {
            static get typeName() {
                return 'TypeName'
            }
        }

        mockedFactory = new TypeGeneratorFactory(new Schema())
        mockedFactory.getGenerator = () => ({path: mockedFactory.generatorPath})
    })

    test('swift', () => {
        const actualGenerator = mockedFactory.swift
        expect(actualGenerator.path).toBe('../swift/types/SwiftTypeNameTypeGenerator')
    })

    test('java', () => {
        const actualGenerator = mockedFactory.java
        expect(actualGenerator.path).toBe('../java/types/JavaTypeNameTypeGenerator')
    })
})