const t = require('../../common')

describe('Type', () => {
    let Type, type

    beforeEach(() => {
        Type = t.requireModule('schema/types/Type')
        type = new Type()
    })

    test('isValid', () => {
        expect(type.isValid).toEqual({validity: true, error: null})
    })

    test('getHostGeneratorClass', () => {
        class StringType extends Type {
        }

        const stringType = new StringType(undefined)
        const JavaStringTypeGenerator = t.requireModule('generation/host/swift/types/SwiftStringTypeGenerator')

        const generatorClass = stringType.getHostGeneratorClass('swift', 'Swift')

        expect(generatorClass).toBe(JavaStringTypeGenerator)
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

        const testType = new TestType(undefined)
        expect(testType.toString()).toBe('test...')
    })

    test('fromObj String', () => {
        const instance = Type.fromObj({type: 'String'})
        expect(instance).toBeInstanceOf(t.requireModule('schema/types/StringType'))
    })

    test('fromObj Class', () => {
        const instance = Type.fromObj({type: 'Object', className: 'MyName'})
        expect(instance).toBeInstanceOf(t.requireModule('schema/types/ObjectType'))
        expect(instance.className).toBe('MyName')
    })
})