const t = require('../test-utils')

describe('Constructor', () => {

    let Constructor, Parameter, IntType, StringType, VoidType, intParam

    beforeEach(() => {
        Constructor = t.requireModule('schema/Constructor')
        Parameter = t.requireModule('schema/Parameter')
        IntType = t.requireModule('schema/types/IntType')
        VoidType = t.requireModule('schema/types/VoidType')
        StringType = t.requireModule('schema/types/StringType')
        intParam = new Parameter(new IntType(), 'intPar', 'intPar desc')
    })

    test('getHostGeneratorClass', () => {
        const ExpectedGeneratorClass = new Constructor().getHostGeneratorClass('swift', 'Swift')

        const GeneratorClass = t.requireModule('generation/host/swift/SwiftConstructorGenerator')

        expect(ExpectedGeneratorClass).toBe(GeneratorClass)
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
})