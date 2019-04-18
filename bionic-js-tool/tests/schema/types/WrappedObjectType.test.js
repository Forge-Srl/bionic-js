const t = require('../../test-utils')

describe('WrappedObjectType', () => {

    let WrappedObjectType

    beforeEach(() => {
        WrappedObjectType = t.requireModule('schema/types/WrappedObjectType')
    })

    test('typeName', () => {
        expect(WrappedObjectType.typeName).toBe('WrappedObject')
    })

    test('clone', () => {
        const wrappedObject = new WrappedObjectType('className')
        const wrappedObjectClone = wrappedObject.clone

        expect(wrappedObject).not.toBe(wrappedObjectClone)
        expect(wrappedObject).toEqual(wrappedObjectClone)
        expect(wrappedObjectClone).toBeInstanceOf(WrappedObjectType)
    })
})