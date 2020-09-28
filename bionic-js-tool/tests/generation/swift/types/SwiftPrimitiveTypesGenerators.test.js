const t = require('../../../test-utils')
let typesGeneratorsPath = 'generation/swift/types/'

describe('Swift primitive types generators', () => {

    const primitiveTypesExpectations = [
        {
            name: 'JsRef',
            statement: 'BjsAnyObject',
            nativeReturnTypeStatement: ' -> BjsAnyObject',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'Bool',
            statement: 'Bool?',
            nativeReturnTypeStatement: ' -> Bool?',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'Date',
            statement: 'Date?',
            nativeReturnTypeStatement: ' -> Date?',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'Float',
            statement: 'Double?',
            nativeReturnTypeStatement: ' -> Double?',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'Int',
            statement: 'Int?',
            nativeReturnTypeStatement: ' -> Int?',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'String',
            statement: 'String?',
            nativeReturnTypeStatement: ' -> String?',
            nativeReturnStatement: 'return ',
        },
        {
            name: 'Void',
            alwaysReturningCode: false,
            statement: 'Void',
            nativeReturnTypeStatement: '',
            nativeReturnStatement: '',
        },
        {
            name: 'Void',
            alwaysReturningCode: true,
            statement: 'Void',
            nativeReturnTypeStatement: '',
            nativeReturnStatement: '_ = ',
        },
    ]

    for (const expectation of primitiveTypesExpectations) {
        const generatorClassName = `Swift${expectation.name}TypeGenerator`
        const Generator = t.requireModule(`${typesGeneratorsPath}/${generatorClassName}`)[generatorClassName]
        const generator = new Generator()

        test(`getTypeStatement of ${expectation.name}`, () => {
            expect(generator.getTypeStatement()).toBe(expectation.statement)
        })

        test(`getNativeReturnTypeStatement of ${expectation.name}`, () => {
            expect(generator.getNativeReturnTypeStatement()).toBe(expectation.nativeReturnTypeStatement)
        })

        test(`getNativeReturnStatement of ${expectation.name}`, () => {
            if (expectation.alwaysReturningCode === undefined) {
                expect(generator.getNativeReturnStatement(true)).toBe(expectation.nativeReturnStatement)
                expect(generator.getNativeReturnStatement(false)).toBe(expectation.nativeReturnStatement)
            } else {
                expect(generator.getNativeReturnStatement(expectation.alwaysReturningCode)).toBe(expectation.nativeReturnStatement)
            }
        })
    }
})