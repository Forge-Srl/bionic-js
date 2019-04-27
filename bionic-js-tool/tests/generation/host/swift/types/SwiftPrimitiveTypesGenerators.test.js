const t = require('../../../../test-utils')
let typesGeneratorsPath = 'generation/host/swift/types/'

describe('Swift primitive types generators', () => {

    const primitiveTypesExpectations = [
        {
            name: 'Any',
            statement: 'BjsAnyObject',
            nativeReturnTypeStatement: ' -> BjsAnyObject',
            nativeReturnStatement: 'return '
        },
        {
            name: 'Bool',
            statement: 'Bool?',
            nativeReturnTypeStatement: ' -> Bool?',
            nativeReturnStatement: 'return '
        },
        {
            name: 'Date',
            statement: 'Date?',
            nativeReturnTypeStatement: ' -> Date?',
            nativeReturnStatement: 'return '
        },
        {
            name: 'Float',
            statement: 'Double?',
            nativeReturnTypeStatement: ' -> Double?',
            nativeReturnStatement: 'return '
        },
        {
            name: 'Int',
            statement: 'Int?',
            nativeReturnTypeStatement: ' -> Int?',
            nativeReturnStatement: 'return '
        },
        {
            name: 'String',
            statement: 'String?',
            nativeReturnTypeStatement: ' -> String?',
            nativeReturnStatement: 'return '
        },
        {
            name: 'Void',
            statement: 'Void',
            nativeReturnTypeStatement: '',
            nativeReturnStatement: '_ = '
        },
    ]

    for (const expectation of primitiveTypesExpectations) {
        const Generator = t.requireModule(`${typesGeneratorsPath}/Swift${expectation.name}TypeGenerator`)
        const generator = new Generator()

        test(`getTypeStatement of ${expectation.name}`, () => {
            expect(generator.getTypeStatement()).toBe(expectation.statement)
        })

        test(`getNativeReturnTypeStatement of ${expectation.name}`, () => {
            expect(generator.getNativeReturnTypeStatement()).toBe(expectation.nativeReturnTypeStatement)
        })

        test(`getNativeReturnStatement of ${expectation.name}`, () => {
            expect(generator.getNativeReturnStatement()).toBe(expectation.nativeReturnStatement)
        })
    }
})