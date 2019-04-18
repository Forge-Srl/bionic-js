const t = require('../../test-utils')

describe('ArrayType', () => {
    let ArrayType, IntType

    beforeEach(() => {
        ArrayType = t.requireModule('schema/types/ArrayType')
        IntType = t.requireModule('schema/types/IntType')
    })

    test('constructor', () => {
        const arrayType = new ArrayType('element...')
        expect(arrayType.typeName).toBe('Array')
        expect(arrayType.elementType).toBe('element...')
    })

    test('isValid', () => {
        const StringType = t.requireModule('schema/types/stringType')
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
        const Type = t.requireModule('schema/types/Type')
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
        const VoidType = t.requireModule('schema/types/VoidType')
        const arrayType = new ArrayType(new VoidType())
        const isValid = arrayType.isValid
        expect(isValid.validity).toBeFalsy()
        expect(isValid.error).toBe('VoidType is not valid as element type')
    })

    test('toString', () => {
        let arrayType = new ArrayType({toString: () => "elementType..."})
        expect(arrayType.toString()).toBe('Array<elementType...>')
    })

    test('typeName', () => {
        expect(ArrayType.typeName).toBe('Array')
    })

    test('fromObj', () => {
        const arrayType = ArrayType.fromObj({elementType: {type: 'String'}})
        expect(arrayType).toBeInstanceOf(ArrayType)
        expect(arrayType.elementType).toBeInstanceOf(t.requireModule('schema/types/StringType'))
    })
})