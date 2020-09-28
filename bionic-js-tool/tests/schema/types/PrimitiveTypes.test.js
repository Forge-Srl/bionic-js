const t = require('../../test-utils')

describe('Primitive types', () => {

    const primitives = ['Bool', 'Date', 'Float', 'Int', 'JsRef', 'String', 'Void']
    const getTypeClass = typeName => t.requireModule(`schema/types/${typeName}Type`)[`${typeName}Type`]

    test('Non primitive types count', () => {
        const allTypes = Object.keys(t.requireModule('schema/types/getTypeClasses')())
        let nonPrimitiveTypes = allTypes.length - primitives.length
        expect(nonPrimitiveTypes).toBe(6)
    })

    describe('typeName', () => {
        for (const typeName of primitives)
            test(typeName, () => {
                const TypeClass = getTypeClass(typeName)

                expect(TypeClass.typeName).toBe(typeName)
                const typeInstance = new TypeClass()
                expect(typeInstance.toString()).toBe(typeName)
                expect(typeInstance.typeName).toBe(typeName)
            })
    })

    describe('clone', () => {
        for (const typeName of primitives)
            test(typeName, () => {
                const TypeClass = getTypeClass(typeName)

                const type = new TypeClass()
                const typeClone = type.clone

                expect(typeClone).not.toBe(type)
                expect(typeClone).toEqual(type)
            })
    })

    describe('isValid', () => {
        for (const typeName of primitives)
            test(typeName, () => {
                const TypeClass = getTypeClass(typeName)

                expect(new TypeClass().isValid).toEqual({validity: true, error: null})
            })
    })
})