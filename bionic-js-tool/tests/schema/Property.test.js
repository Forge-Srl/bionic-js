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
            name: 'getter', description: 'getter desc', isStatic: false,
            type: {type: 'Int'}, kinds: ['get', 'set'],
        }

        const expectedProperty = new Property('getter', 'getter desc', false, new IntType(), ['get', 'set'])

        const property = Property.fromObj(propertyObj)

        expect(property).toBeInstanceOf(Property)
        expect(property.type).toBeInstanceOf(IntType)
        expect(property).toEqual(expectedProperty)
    })

    test('dependingTypes', () => {
        const type = {dependingTypes: ['type1', 'type2']}
        const property = new Property('', '', false, type, [])
        expect(property.dependingTypes).toStrictEqual([type, ...type.dependingTypes])
    })

    test('resolveClassType', () => {
        const type = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedType'
            },
        }
        const property = new Property('name', 'desc', false, type, ['get'])
        expect(property.resolveClassType('nativeClassesMap')).toStrictEqual(new Property('name', 'desc', false, 'resolvedType', ['get']))
    })
})