const t = require('../../test-utils')
const LambdaType = t.requireModule('schema/types/LambdaType').LambdaType

describe('LambdaType', () => {

    test('typeName', () => {
        expect(LambdaType.typeName).toBe('Lambda')
    })

    test('fromObj', () => {
        const lambdaType = LambdaType.fromObj({
            returnType: {type: 'String'},
            parameters: [
                {type: {type: 'Int'}, name: 'par1', description: 'desc1'},
                {type: {type: 'Any'}, name: 'par2', description: 'desc2'}
            ]
        })

        expect(lambdaType).toBeInstanceOf(LambdaType)
        const StringType = t.requireModule('schema/types/StringType').StringType
        expect(lambdaType.returnType).toBeInstanceOf(StringType)

        const Parameter = t.requireModule('schema/Parameter').Parameter
        const parameters = lambdaType.parameters
        expect(parameters.length).toBe(2)

        expect(parameters[0]).toBeInstanceOf(Parameter)
        const IntType = t.requireModule('schema/types/IntType').IntType
        expect(parameters[0].type).toBeInstanceOf(IntType)
        expect(parameters[0].name).toBe('par1')
        expect(parameters[0].description).toBe('desc1')

        expect(parameters[1]).toBeInstanceOf(Parameter)
        const AnyType = t.requireModule('schema/types/AnyType').AnyType
        expect(parameters[1].type).toBeInstanceOf(AnyType)
        expect(parameters[1].name).toBe('par2')
        expect(parameters[1].description).toBe('desc2')
    })

    test('constructor', () => {
        const lambdaType = new LambdaType('retType...', 'parameters...')
        expect(lambdaType.typeName).toBe('Lambda')
        expect(lambdaType.returnType).toBe('retType...')
        expect(lambdaType.parameters).toBe('parameters...')
    })

    test('is valid and all is valid', () => {
        const lambdaType = new LambdaType(
            {isValid: {validity: true}},
            [{type: {isValid: {validity: true}}}, {type: {isValid: {validity: true}}}]
        )
        expect(lambdaType.isValid).toEqual({
            validity: true,
            error: null
        })
    })

    test('is valid and return type is not valid', () => {
        const lambdaType = new LambdaType(
            {
                isValid: {
                    validity: false,
                    error: 'return type error...'
                }
            },
            [{type: {isValid: {validity: true}}}, {type: {isValid: {validity: true}}}]
        )
        expect(lambdaType.isValid).toEqual({
            validity: false,
            error: 'invalid return type: return type error...'
        })
    })

    test('is valid and a parameter is not valid', () => {
        const lambdaType = new LambdaType(
            {isValid: {validity: true}},
            [{
                name: 'param name...',
                type: {
                    isValid: {
                        validity: false,
                        error: 'param type error...'
                    }
                }
            }, {type: {isValid: {validity: true}}}]
        )
        expect(lambdaType.isValid).toEqual({
            validity: false,
            error: 'invalid type for parameter:"param name...": param type error...'
        })
    })

    test('toString', () => {
        const lambdaType = new LambdaType(
            {toString: () => 'RetType'},
            [{type: {toString: () => 'Par1Type'}}, {type: {toString: () => 'Par2Type'}}]
        )

        expect(lambdaType.toString()).toBe('(Par1Type, Par2Type) => RetType')
    })
})