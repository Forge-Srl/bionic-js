const t = require('../common')

describe('Property', () => {

    let Property, IntType

    beforeEach(() => {
        Property = t.requireModule('schema/Property')
        IntType = t.requireModule('schema/types/IntType')
    })

    test('getHostGeneratorClass', () => {
        const ExpectedGeneratorClass = t.requireModule('generation/host/swift/SwiftPropertyGenerator')

        const GeneratorClass = new Property().getHostGeneratorClass('swift', 'Swift')

        expect(GeneratorClass).toBe(ExpectedGeneratorClass)
    })

    test('fromObj', () => {
        const propertyObj = {
            name: 'getter', description: 'getter desc', isStatic: false, isOverriding: false,
            type: {type: 'Int'}, kind: 'get'
        }

        const expectedProperty = new Property('getter', 'getter desc', false, false, new IntType(), 'get')

        const property = Property.fromObj(propertyObj)

        expect(property).toBeInstanceOf(Property)
        expect(property.type).toBeInstanceOf(IntType)
        expect(property).toEqual(expectedProperty)
    })
})