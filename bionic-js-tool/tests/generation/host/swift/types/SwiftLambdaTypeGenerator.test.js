const t = require('../../../../test-utils')

describe('SwiftLambdaTypeGenerator', () => {

    let SwiftLambdaTypeGenerator

    beforeEach(() => {
        SwiftLambdaTypeGenerator = t.requireModule('generation/host/swift/types/SwiftLambdaTypeGenerator')
    })

    test('getTypeStatement', () => {

        const generator = new SwiftLambdaTypeGenerator({
            returnType: {getSwiftGenerator: () => ({getTypeStatement: () => 'ret_type_statement'})},
            parameters: [
                {getSwiftGenerator: () => ({getParameterStatement: () => 'par1_type_statement'})},
                {getSwiftGenerator: () => ({getParameterStatement: () => 'par2_type_statement'})},
            ],
        })

        expect(generator.getTypeStatement()).toBe('((par1_type_statement, par2_type_statement) -> ret_type_statement)?')
    })

    test('getTypeStatement with no parameters', () => {

        const generator = new SwiftLambdaTypeGenerator({
            returnType: {getSwiftGenerator: () => ({getTypeStatement: () => 'ret_type_statement'})},
            parameters: [],
        })

        expect(generator.getTypeStatement()).toBe('(() -> ret_type_statement)?')
    })
})