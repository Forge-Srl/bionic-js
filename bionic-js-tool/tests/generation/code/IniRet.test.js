const t = require('../../test-utils')
const codeDir = 'generation/code/'

describe('IniRet', () => {
    let IniRet, CodeBlock

    beforeEach(() => {
        IniRet = t.requireModule(`${codeDir}IniRet`)
        CodeBlock = t.requireModule(`${codeDir}CodeBlock`)
    })

    test('create', () => {
        const iniRet = IniRet.create()
        expect(iniRet.returningCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.returningCode.codeElements).toEqual([])
        expect(iniRet.initializationCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.initializationCode.codeElements).toEqual([])
    })

    test('append', () => {
        fail('todo')
    })
})