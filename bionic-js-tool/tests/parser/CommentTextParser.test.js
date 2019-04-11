const t = require('../common/index')

describe('Comment text parser', () => {

    let Parser

    beforeEach(() => {
        Parser = t.requireModule('parser/Parser')
    })

    const testParsing = (annotation, expectedResult) => {
        const parseResult = Parser.parse(annotation, {startRule: 'CommentText'})
        expect(parseResult).toEqual(expectedResult)
    }

    test('parse empty line', () => testParsing('', []))

    test('parse empty lines', () => testParsing('\n\n\n \n', ['', '', '', '']))

    test('parse spaces line', () => testParsing('   ', ['']))

    test('parse 2 empty lines', () => testParsing(`
        `, ['', '']))

    test('parse line', () => testParsing('   some text   ', ['some text']))

    test('parse 2 lines', () => testParsing(`some text
        again text`, ['some text', 'again text']))

    test('parse tag', () => testParsing(' @tag ', ['@tag']))

    test('parse tag inline', () => testParsing(' @tag just @text ', ['@tag just @text']))

    test('parse tag multiline', () => testParsing(` @tag just @text
        just @text again `, ['@tag just @text\njust @text again']))

    test('parse multiple tags', () => testParsing(` @tag1
        @tag2 `, ['@tag1', '@tag2']))

    test('parse multiple tags inline', () => testParsing(` @tag1 just @text
        @tag2 just @text again `, ['@tag1 just @text', '@tag2 just @text again']))

    test('parse multiple tags multiline', () => testParsing(` @tag1 just @text
        just @text again 
        @tag2
        just @text`, ['@tag1 just @text\njust @text again', '@tag2\njust @text']))

    test('ignore comment asterisks', () => testParsing(` * line 1
        **  line 2 
        @line3 tag
        *   tag continuation
        *  @line4`, ['line 1', '*  line 2', '@line3 tag\ntag continuation', '@line4']))
})