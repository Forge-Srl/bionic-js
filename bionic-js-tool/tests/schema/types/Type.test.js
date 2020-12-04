const t = require('../../test-utils')

describe('Type', () => {
    let Type, type, TypeGeneratorFactory

    beforeEach(() => {
        Type = t.requireModule('schema/types/Type').Type
        type = new Type()
        TypeGeneratorFactory = t.requireModule('generation/factory/TypeGeneratorFactory').TypeGeneratorFactory
    })

    test('fromObj String', () => {
        const instance = Type.fromObj({type: 'String'})
        const StringType = t.requireModule('schema/types/StringType').StringType
        expect(instance).toBeInstanceOf(StringType)
    })

    test('fromObj Class', () => {
        const instance = Type.fromObj({type: 'Class', className: 'MyName'})
        const ClassType = t.requireModule('schema/types/ClassType').ClassType
        expect(instance).toBeInstanceOf(ClassType)
        expect(instance.className).toBe('MyName')
    })

    test('fromObj NativeRef', () => {
        const instance = Type.fromObj({type: 'NativeRef', className: 'MyName'})
        const NativeRefType = t.requireModule('schema/types/NativeRefType').NativeRefType
        expect(instance).toBeInstanceOf(NativeRefType)
        expect(instance.className).toBe('MyName')
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

    test('resolveClassType', () => {
        expect(type.resolveClassType()).toBe(type)
    })

    test('isEqualTo', () => {
        class Type1 extends Type {
            static get typeName() {
                return 'Type1'
            }
        }
        class Type2 extends Type {
            static get typeName() {
                return 'Type2'
            }
        }
        class Type1Similar extends Type {
            static get typeName() {
                return 'Type1'
            }
            constructor() {
                super();
                this.field = 'different'
            }
        }
        class Type1Clone extends Type {
            static get typeName() {
                return 'Type1'
            }
        }

        expect(new Type1().isEqualTo(new Type2())).toBe(false)
        expect(new Type1().isEqualTo(new Type1Similar())).toBe(false)
        expect(new Type1().isEqualTo(new Type1Clone())).toBe(true)
    })
})
