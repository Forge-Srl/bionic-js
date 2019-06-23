const t = require('../../test-utils')
const codeDir = 'generation/code/'

describe('IniRet', () => {
    let IniRet, CodeBlock, iniRet

    beforeEach(() => {
        IniRet = t.requireModule(`${codeDir}IniRet`).IniRet
        CodeBlock = t.requireModule(`${codeDir}CodeBlock`).CodeBlock
        iniRet = new IniRet(CodeBlock.create().append('ret'), CodeBlock.create().append('ini'))
    })

    test('create', () => {
        const iniRet = IniRet.create()
        expect(iniRet.returningCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.returningCode.codeElements).toEqual([])
        expect(iniRet.initializationCode).toBeInstanceOf(CodeBlock)
        expect(iniRet.initializationCode.codeElements).toEqual([])
    })

    test('append', () => {
        const toAppend = new IniRet(CodeBlock.create().append('-append-ret'), CodeBlock.create().append('-append-ini'))

        const actualIniRet = iniRet.append(toAppend)

        expect(actualIniRet).toBe(iniRet)
        expect(actualIniRet.returningCode.getString()).toBe('ret-append-ret')
        expect(actualIniRet.initializationCode.getString()).toBe('ini-append-ini')
    })

    test('appendRet', () => {
        const actualIniRet = iniRet.appendRet('-append-ret')

        expect(actualIniRet).toBe(iniRet)
        expect(actualIniRet.returningCode.getString()).toBe('ret-append-ret')
        expect(actualIniRet.initializationCode.getString()).toBe('ini')
    })

    test('appendIni', () => {
        const actualIniRet = iniRet.appendIni('-append-ini')

        expect(actualIniRet).toBe(iniRet)
        expect(actualIniRet.returningCode.getString()).toBe('ret')
        expect(actualIniRet.initializationCode.getString()).toBe('ini-append-ini')
    })

    test('editRet', () => {
        const actualIniRet = iniRet.editRet(ret => ret.append('-append-ret'))

        expect(actualIniRet).toBe(iniRet)
        expect(actualIniRet.returningCode.getString()).toBe('ret-append-ret')
        expect(actualIniRet.initializationCode.getString()).toBe('ini')
    })

    test('editIni', () => {
        const actualIniRet = iniRet.editIni(ini => ini.append('-append-ini'))

        expect(actualIniRet).toBe(iniRet)
        expect(actualIniRet.returningCode.getString()).toBe('ret')
        expect(actualIniRet.initializationCode.getString()).toBe('ini-append-ini')
    })

    test('__', () => {
        expect(iniRet.__).toBe(iniRet)
    })
})