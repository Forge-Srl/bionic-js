const t = require('../test-utils')

describe('Method', () => {

    let Method, Parameter, IntType, StringType, VoidType, intParam, stringParam

    beforeEach(() => {
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        StringType = t.requireModule('schema/types/StringType').StringType
        intParam = new Parameter(new IntType(), 'intPar', 'intPar desc')
        stringParam = new Parameter(new StringType(), 'stringPar', 'stringPar desc')
    })

    test('schemaName', () => {
        expect(Method.schemaName).toBe('Method')
    })

    test('fromObj', () => {
        const methodObj = {
            name: 'methodWithParameters', description: 'methodWithParameters desc', isStatic: false,
            returnType: {type: 'Void'},
            parameters: [
                {type: {type: 'Int'}, name: 'intPar', description: 'intPar desc'},
                {type: {type: 'String'}, name: 'stringPar', description: 'stringPar desc'},
            ],
        }
        const method = Method.fromObj(methodObj)

        const expectedMethod = new Method('methodWithParameters', 'methodWithParameters desc', false, new VoidType(),
            [intParam, stringParam])

        expect(method).toBeInstanceOf(Method)
        expect(method.returnType).toBeInstanceOf(VoidType)
        expect(method.parameters[0]).toBeInstanceOf(Parameter)
        expect(method.parameters[1]).toBeInstanceOf(Parameter)
        expect(method).toEqual(expectedMethod)
    })

    test('resolveClassType', () => {
        const returnType = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedReturnType'
            },
        }
        const parameter = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedParameter'
            },
        }
        const method = new Method('name', 'desc', true, returnType, [parameter])
        expect(method.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new Method('name', 'desc', true, 'resolvedReturnType', ['resolvedParameter']))
    })
})