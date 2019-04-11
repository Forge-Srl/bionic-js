const t = require('../../common')

describe('ObjectType', () => {

    let Validation, ObjectType

    beforeEach(() => {
        Validation = t.mockAndRequireModule('schema/Validation')
        ObjectType = t.requireModule('schema/types/ObjectType')
    })

    test('typeName', () => {
        expect(ObjectType.typeName).toBe('Object')
    })

    test('clone', () => {
        const classObj = new ObjectType('className')
        const classObjClone = classObj.clone

        expect(classObj).not.toBe(classObjClone)
        expect(classObj).toEqual(classObjClone)
    })

    test('constructor', () => {
        const arrayType = new ObjectType('class...')
        expect(arrayType.typeName).toBe('Object')
        expect(arrayType.className).toBe('class...')
    })

    test('is valid', () => {
        let classType = new ObjectType('ClassName')

        const result = 'result'
        Validation.validateIdentifier.mockReturnValueOnce(result)

        expect(classType.isValid).toBe(result)
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })

    test('toString', () => {
        let classType = new ObjectType('class...')
        expect(classType.toString()).toBe('class...')
    })
})