const t = require('../../test-utils')

describe('ArrayType', () => {
    let ArrayType

    beforeEach(() => {
        ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
    })

    test('fromObj', () => {
        const arrayType = ArrayType.fromObj({elementType: {type: 'String'}})
        expect(arrayType).toBeInstanceOf(ArrayType)
        const StringType = t.requireModule('schema/types/StringType').StringType
        expect(arrayType.elementType).toBeInstanceOf(StringType)
    })

    test('constructor', () => {
        const arrayType = new ArrayType('element...')
        expect(arrayType.typeName).toBe('Array')
        expect(arrayType.elementType).toBe('element...')
    })

    test('isValid', () => {
        const StringType = t.requireModule('schema/types/StringType').StringType
        const arrayType = new ArrayType(new StringType())
        const isValid = arrayType.isValid
        expect(isValid.validity).toBeTruthy()
        expect(isValid.error).toBeNull()
    })

    test('isValid when element type is not a subclass of Type', () => {
        const arrayType = new ArrayType([])
        const isValid = arrayType.isValid
        expect(isValid.validity).toBeFalsy()
        expect(isValid.error).toBe('element type is not a subclass of Type')
    })

    test('isValid when element type is null', () => {
        const arrayType = new ArrayType(null)
        const isValid = arrayType.isValid
        expect(isValid.validity).toBeFalsy()
        expect(isValid.error).toBe('element type is not a subclass of Type')
    })

    test('isValid when element type is not valid', () => {
        const Type = t.requireModule('schema/types/Type').Type
        const invalidType = new Type()
        t.mockGetter(invalidType, 'isValid', () => {
            return {validity: false, error: 'error!'}
        })
        const arrayType = new ArrayType(invalidType)

        const isValid = arrayType.isValid
        expect(invalidType.isValid_get).toBeCalled()
        expect(isValid.validity).toBeFalsy()
        expect(isValid.error).toBe('error!')
    })

    test('isValid with VoidType', () => {
        const VoidType = t.requireModule('schema/types/VoidType').VoidType
        const arrayType = new ArrayType(new VoidType())
        const isValid = arrayType.isValid
        expect(isValid.validity).toBeFalsy()
        expect(isValid.error).toBe('VoidType is not valid as element type')
    })

    test('dependingTypes', () => {
        let elementType = {dependingTypes: ['type1', 'type2']}
        let arrayType = new ArrayType(elementType)
        expect(arrayType.dependingTypes).toStrictEqual([elementType, ...elementType.dependingTypes])
    })

    test('toString', () => {
        let arrayType = new ArrayType({toString: () => 'elementType...'})
        expect(arrayType.toString()).toBe('Array<elementType...>')
    })

    test('typeName', () => {
        expect(ArrayType.typeName).toBe('Array')
    })

    test('resolveClassType, primitive type', () => {
        const elementType = {
            resolveClassType: (nativeClassesMap) => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'nativeType'
            },
        }
        const arrayType = new ArrayType(elementType)
        expect(arrayType.resolveClassType('nativeClassesMap')).toStrictEqual(new ArrayType('nativeType'))
    })
})