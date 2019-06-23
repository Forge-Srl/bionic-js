const t = require('../test-utils')

describe('Property', () => {

    let Property, IntType

    beforeEach(() => {
        Property = t.requireModule('schema/Property').Property
        IntType = t.requireModule('schema/types/IntType').IntType
    })

    test('schemaName', () => {
        expect(Property.schemaName).toBe('Property')
    })

    test('fromObj', () => {
        const propertyObj = {
            name: 'getter', description: 'getter desc', isStatic: false, isOverriding: false,
            type: {type: 'Int'}, kinds: ['get', 'set']
        }

        const expectedProperty = new Property('getter', 'getter desc', false, false, new IntType(), ['get', 'set'])

        const property = Property.fromObj(propertyObj)

        expect(property).toBeInstanceOf(Property)
        expect(property.type).toBeInstanceOf(IntType)
        expect(property).toEqual(expectedProperty)
    })
})