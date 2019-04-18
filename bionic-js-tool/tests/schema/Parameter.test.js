const t = require('../test-utils')

describe('Parameter', () => {

    let Parameter, ObjectType

    beforeEach(() => {
        Parameter = t.requireModule('schema/Parameter')
        ObjectType = t.requireModule('schema/types/ObjectType')
    })

    test('fromObj', () => {
        const parameter = Parameter.fromObj({
            type: {type: 'Object', className: 'Class1'},
            name: 'classPar',
            description: 'classPar desc'
        })

        const expectedParameter = new Parameter(new ObjectType('Class1'), 'classPar', 'classPar desc')

        expect(parameter).toBeInstanceOf(Parameter)
        expect(parameter.type).toBeInstanceOf(ObjectType)
        expect(parameter).toEqual(expectedParameter)
    })

    test('getHostGeneratorClass', () => {
        const ExpectedGeneratorClass = t.requireModule('generation/host/swift/SwiftParameterGenerator')

        const GeneratorClass = new Parameter().getHostGeneratorClass('swift', 'Swift')

        expect(GeneratorClass).toBe(ExpectedGeneratorClass)
    })
})