const t = require('../../test-utils')
const codeDir = 'generation/code/'
const codeElementsDir = `${codeDir}/codeElements/`

describe('CodeBlock', () => {
    let Indentation, indentation, NewLine, newLine, InlineCode, inlineCode, StringBuilder, CodeBlock, codeBlock

    beforeEach(() => {
        t.resetModulesCache()

        indentation = {fake: 'indentation'}
        Indentation = t.mockAndRequireModule(`${codeElementsDir}Indentation`).Indentation
            .mockImplementation(() => indentation)

        newLine = {fake: 'newLine'}
        NewLine = t.mockAndRequireModule(`${codeElementsDir}NewLine`).NewLine
            .mockImplementation(() => newLine)

        inlineCode = {fake: 'inlineCode'}
        InlineCode = t.mockAndRequireModule(`${codeElementsDir}InlineCode`).InlineCode
            .mockImplementation(() => inlineCode)

        StringBuilder = t.mockAndRequireModule(`${codeDir}StringBuilder`).StringBuilder
        CodeBlock = t.requireModule(`${codeDir}CodeBlock`).CodeBlock
        codeBlock = new CodeBlock()
    })

    test('just construct', () => {
        expect(codeBlock.codeElements).toEqual([])
    })

    test('create CodeBlock', () => {
        const newCodeBlock = CodeBlock.create()
        expect(newCodeBlock).toBeInstanceOf(CodeBlock)
        expect(newCodeBlock.codeElements).toEqual([])
    })

    test('create CodeBlock with startIndentation', () => {
        const newCodeBlock = CodeBlock.create(2)
        expect(newCodeBlock).toBeInstanceOf(CodeBlock)
        expect(newCodeBlock.codeElements).toEqual([indentation])
        expect(Indentation).toBeCalledWith(2)
    })

    test('getString with no codeElements', () => {
        const stringBuilder = {getString: () => 'code'}
        StringBuilder.mockImplementation(() => stringBuilder)
        expect(codeBlock.getString()).toBe('code')
    })

    test('getString with two codeElements', () => {
        codeBlock.codeElements = [
            {appendToBuilder: t.mockFn(() => 11)},
            {appendToBuilder: t.mockFn(() => 22)},
        ]
        const stringBuilder = {getString: () => 'code'}
        StringBuilder.mockImplementation(() => stringBuilder)

        expect(codeBlock.getString()).toBe('code')
        expect(codeBlock.codeElements[0].appendToBuilder).toBeCalledWith(stringBuilder, 0)
        expect(codeBlock.codeElements[1].appendToBuilder).toBeCalledWith(stringBuilder, 11)
    })

    test('newLine', () => {
        const result = codeBlock.newLine()

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([newLine, indentation])
    })

    test('newLineIndenting', () => {
        const result = codeBlock.newLineIndenting()

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([newLine, indentation])
        expect(Indentation).toBeCalledWith(1)
    })

    test('newLineIndenting with custom indentation', () => {
        const result = codeBlock.newLineIndenting(2)

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([newLine, indentation])
        expect(Indentation).toBeCalledWith(2)
    })

    test('newLineDeindenting', () => {
        const result = codeBlock.newLineDeindenting()

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([newLine, indentation])
        expect(Indentation).toBeCalledWith(-1)
    })

    test('newLineDeindenting with custom indentation', () => {
        const result = codeBlock.newLineDeindenting(-2)

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([newLine, indentation])
        expect(Indentation).toBeCalledWith(-2)
    })

    test('appendString', () => {
        const result = codeBlock.appendString('simple string')

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([inlineCode])
        expect(InlineCode).toBeCalledWith('simple string')
    })

    test('appendCodeBlock', () => {
        const anotherCodeBlock = {codeElements: ['line1', 'line2']}

        const result = codeBlock.appendCodeBlock(anotherCodeBlock)

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual(['line1', 'line2'])
    })

    test('appendCodeElement', () => {
        const codeElement = {code: 'element'}

        const result = codeBlock.appendCodeElement(codeElement)

        expect(result).toBe(codeBlock)
        expect(codeBlock.codeElements).toEqual([codeElement])
    })

    test('append null or empty string', () => {

        expect(codeBlock.append()).toEqual(codeBlock)
        expect(codeBlock.append(null)).toEqual(codeBlock)
        expect(codeBlock.append('')).toEqual(codeBlock)
    })

    test('append an array', () => {

        const codeBlock2 = {
            append: obj => {
                return codeBlock.result + obj
            }
        }

        codeBlock.appendString = str => {
            codeBlock.result = str
            return codeBlock2
        }

        const array = ['str1 ', 'str2']
        expect(codeBlock.append(array)).toBe('str1 str2')
    })

    test('append a string', () => {

        codeBlock.appendString = t.mockReturnValueOnce('this')

        const obj = 'string'
        expect(codeBlock.append(obj)).toEqual('this')
        expect(codeBlock.appendString).toBeCalledWith(obj)
    })

    test('append a CodeBlock', () => {

        codeBlock.appendCodeBlock = t.mockReturnValueOnce('this')

        const obj = CodeBlock.create()
        expect(codeBlock.append(obj)).toEqual('this')
        expect(codeBlock.appendCodeBlock).toBeCalledWith(obj)
    })

    test('append an appendable object', () => {

        codeBlock.appendCodeElement = t.mockReturnValueOnce('this')

        const obj = {appendToBuilder: 'func'}
        expect(codeBlock.append(obj)).toEqual('this')
        expect(codeBlock.appendCodeElement).toBeCalledWith(obj)
    })

    test('append a non appendable object', () => {

        expect(() => codeBlock.append({})).toThrow('Object cannot be appended')
    })

    test('__', () => {
        expect(codeBlock.__).toBe(codeBlock)
    })
})