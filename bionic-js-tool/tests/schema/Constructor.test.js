const t = require('../test-utils')

describe('Constructor', () => {

    let Constructor, Parameter, IntType, StringType, VoidType, intParam

    beforeEach(() => {
        Constructor = t.requireModule('schema/Constructor').Constructor
        Parameter = t.requireModule('schema/Parameter').Parameter
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
        StringType = t.requireModule('schema/types/StringType').StringType
        intParam = new Parameter(new IntType(), 'intPar', 'intPar desc')
    })

    test('schemaName', () => {
        expect(Constructor.schemaName).toBe('Constructor')
    })

    test('fromObj', () => {
        const constructorObj = {
            description: 'constructorWithParameters desc',
            parameters: [
                {type: {type: 'Int'}, name: 'intPar', description: 'intPar desc'}
            ],
        }
        const constructor = Constructor.fromObj(constructorObj)

        const expectedConstructor = new Constructor('constructorWithParameters desc', [new Parameter(new IntType(),
            'intPar', 'intPar desc')])

        expect(constructor).toBeInstanceOf(Constructor)
        expect(constructor.parameters[0]).toBeInstanceOf(Parameter)
        expect(constructor).toEqual(expectedConstructor)
    })

    test('resolveClassType', () => {
        const parameter = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedParameter'
            },
        }
        const constructor = new Constructor('desc', [parameter])
        expect(constructor.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new Constructor('desc', ['resolvedParameter']))
    })
})