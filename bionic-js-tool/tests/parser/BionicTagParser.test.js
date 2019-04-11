const t = require('../common/index')

describe('@bionic tag parser', () => {

    let Parser

    beforeEach(() => {
        Parser = t.requireModule('parser/Parser')
    })


    const parse = (input) => Parser.parse(input, {startRule: 'BionicTag'})

    test('parse another tag', () => {
        expect(() => parse(`@anotherTag`)).toThrow()
    })

    test('parse similar tag', () => {
        expect(() => parse(`@bionico`)).toThrow()
    })

    test('parse wrong args', () => {
        expect(() => parse(`@bionic getset name`)).toThrow()
    })

    test('parse empty tag', () => {
        const parseResult = parse('@bionic')
        expect(parseResult).toEqual({})
    })


    const testParsing = (annotation, expectedResult) => {
        const parseResult = parse(`@bionic ${annotation}`)
        expect(parseResult).toEqual(expectedResult)
    }

    const testParsingPrimitiveType = primitiveType =>
        testParsing(primitiveType, {typeInfo: {type: primitiveType}})

    ['Any', 'Bool', 'Date', 'Float', 'Int', 'String', 'Void'].forEach(
        type => test(`parse typeInfo > primitive > ${type}`, () => testParsingPrimitiveType(type)))


    test('parse typeInfo > array of string',
        () => testParsing('Array<String>', {
            typeInfo: {
                type: 'Array',
                elementType: {type: 'String'}
            }
        }))

    test('parse typeInfo > array of array of int',
        () => testParsing('Array<Array<Int>>', {
            typeInfo: {
                type: 'Array',
                elementType: {
                    type: 'Array',
                    elementType: {type: 'Int'}
                }
            }
        }))

    test('parse typeInfo > class',
        () => testParsing('MyClass', {
            typeInfo: {
                type: 'Object',
                className: 'MyClass'
            }
        }))


    const voidReturningLambda = {
        typeInfo: {
            type: 'Lambda',
            parameters: [],
            returnType: {type: 'Void'}
        }
    }

    test('parse typeInfo > void returning lambda', () => testParsing('() => Void', voidReturningLambda))

    test('parse typeInfo > implicit void returning lambda', () => testParsing('()', voidReturningLambda))

    test('parse typeInfo > lambda with parameters names', () => testParsing('(par1: Int, par2: Float)',
        {
            typeInfo: {
                type: 'Lambda',
                parameters: [
                    {name: 'par1', type: {type: 'Int'}},
                    {name: 'par2', type: {type: 'Float'}}
                ],
                returnType: {type: 'Void'}
            }
        }))


    test('parse typeInfo > complex lambda',
        () => testParsing('(() => Void, Array<Array<() => Int>>, class1:MyClass1) => () => Array<MyClass2>', {
            typeInfo: {
                type: 'Lambda',
                parameters: [
                    {
                        type: {
                            type: 'Lambda',
                            parameters: [],
                            returnType: {
                                type: 'Void'
                            }
                        }
                    },
                    {
                        type: {
                            type: 'Array',
                            elementType: {
                                type: 'Array',
                                elementType: {
                                    type: 'Lambda',
                                    parameters: [],
                                    returnType: {
                                        type: 'Int'
                                    }
                                }
                            }
                        }
                    },
                    {
                        type: {
                            type: 'Object',
                            className: 'MyClass1'
                        },
                        name: 'class1'
                    }
                ],
                returnType: {
                    type: 'Lambda',
                    parameters: [],
                    returnType: {
                        type: 'Array',
                        elementType: {
                            type: 'Object',
                            className: 'MyClass2'
                        }
                    }
                }
            }
        }))

    test('parse method declaration > get',
        () => testParsing('get name', {
            kinds: ['get'],
            modifiers: [],
            name: 'name'
        }))

    test('parse method declaration > set',
        () => testParsing('set name', {
            kinds: ['set'],
            modifiers: [],
            name: 'name'
        }))

    test('parse method declaration > get + set',
        () => testParsing('get set name', {
            kinds: ['get', 'set'],
            modifiers: [],
            name: 'name'
        }))

    test('parse method declaration > static + get + set',
        () => testParsing('static get set name', {
            kinds: ['get', 'set'],
            modifiers: ['static'],
            name: 'name'
        }))

    test('parse method declaration > static + async + get + set',
        () => testParsing('static async get set name', {
            kinds: ['get', 'set'],
            modifiers: ['static', 'async'],
            name: 'name'
        }))

    test('parse method declaration > static + async + get + set + typeInfo',
        () => testParsing('static async get set name Int', {
            kinds: ['get', 'set'],
            modifiers: ['static', 'async'],
            name: 'name',
            typeInfo: {type:'Int'}
        }))

    test('parse method declaration > method',
        () => testParsing('method name', {
            kinds: ['method'],
            modifiers: [],
            name: 'name'
        }))

    test('parse method declaration > static + method + typeInfo',
        () => testParsing('static method name Int', {
            kinds: ['method'],
            modifiers: ['static'],
            name: 'name',
            typeInfo: {type: 'Int'}
        }))
})