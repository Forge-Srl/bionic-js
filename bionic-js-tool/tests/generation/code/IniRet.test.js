const t = require('../../common')
const codeDir = 'generation/code/'

describe('IniRet', () => {
    let IniRet, CodeBlock

    beforeEach(() => {
        IniRet = t.requireModule(`${codeDir}IniRet`)
        CodeBlock = t.requireModule(`${codeDir}CodeBlock`)
    })

    test('empty constructor', () => {
        const iniRet = new IniRet()
        expect(iniRet.returningCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.returningCode.codeElements).toEqual([])
        expect(iniRet.initializationCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.initializationCode.codeElements).toEqual([])
    })

    test('append', () => {
        expect(false)
    })
})