const t = require('../test-utils')

describe('Parameter', () => {

    let Parameter, ClassType

    beforeEach(() => {
        Parameter = t.requireModule('schema/Parameter').Parameter
        ClassType = t.requireModule('schema/types/ClassType').ClassType
    })

    test('schemaName', () => {
        expect(Parameter.schemaName).toBe('Parameter')
    })

    test('fromObj', () => {
        const parameter = Parameter.fromObj({
            type: {type: 'Class', className: 'Class1'},
            name: 'classPar',
            description: 'classPar desc',
        })

        const expectedParameter = new Parameter(new ClassType('Class1'), 'classPar', 'classPar desc')

        expect(parameter).toBeInstanceOf(Parameter)
        expect(parameter.type).toBeInstanceOf(ClassType)
        expect(parameter).toEqual(expectedParameter)
    })

    test('resolveClassType', () => {
        const type = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedParameterType'
            },
        }
        const method = new Parameter(type, 'name', 'desc')
        expect(method.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new Parameter('resolvedParameterType', 'name', 'desc'))
    })
})