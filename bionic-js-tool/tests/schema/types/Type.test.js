const t = require('../../test-utils')

describe('Type', () => {
    let Type, type, TypeGeneratorFactory

    beforeEach(() => {
        Type = t.requireModule('schema/types/Type').Type
        type = new Type()
        TypeGeneratorFactory = t.requireModule('generation/factory/TypeGeneratorFactory').TypeGeneratorFactory
    })

    test('isValid', () => {
        expect(type.isValid).toEqual({validity: true, error: null})
    })

    test('generator', () => {
        expect(new Type().generator).toBeInstanceOf(TypeGeneratorFactory)
    })

    test('toString', () => {
        expect(type.toString()).toBeUndefined()
    })

    test('toString from subclass', () => {
        class TestType extends Type {
            static get typeName() {
                return 'test...'
            }
        }

        const testType = new TestType()
        expect(testType.typeName).toBe('test...')
        expect(testType.toString()).toBe('test...')
    })

    test('fromObj String', () => {
        const instance = Type.fromObj({type: 'String'})
        const StringType = t.requireModule('schema/types/StringType').StringType
        expect(instance).toBeInstanceOf(StringType)
    })

    test('fromObj Class', () => {
        const instance = Type.fromObj({type: 'Object', className: 'MyName'})
        const ObjectType = t.requireModule('schema/types/ObjectType').ObjectType
        expect(instance).toBeInstanceOf(ObjectType)
        expect(instance.className).toBe('MyName')
    })
})