const t = require('../../../../test-utils')

describe('SwiftLambdaTypeGenerator', () => {

    let SwiftLambdaTypeGenerator, IniRet, NewLine

    beforeEach(() => {
        SwiftLambdaTypeGenerator = t.requireModule('generation/host/swift/types/SwiftLambdaTypeGenerator')
        IniRet = t.requireModule('generation/code/IniRet')
        NewLine = t.requireModule('generation/code/codeElements/NewLine')
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

    test('getCallerWithNativeIniRet', () => {

        const generator = new SwiftLambdaTypeGenerator({
            returnType: {
                getSwiftGenerator: () => ({
                    getNativeIniRet: (jsIniRet) => IniRet.create()
                        .editIni(ini =>
                            ini.append(jsIniRet.initializationCode)
                                .append('init(jsToNative)').newLine())
                        .editRet(ret => ret.append('jsToNative(').append(jsIniRet.returningCode).append(')')),
                }),
            },
            parameters:
                [{
                    getSwiftGenerator: () => ({
                        getJsIniRet: (nativeRet) => IniRet.create()
                            .editIni(ini => ini.append('init(nativePar1ToJs)').newLine())
                            .editRet(ret => ret.append('nativePar1ToJs(').append(nativeRet).append(')')),
                    }),
                }, {
                    getSwiftGenerator: () => ({
                        getJsIniRet: (nativeRet) => IniRet.create()
                            .editIni(ini => ini.append('init(nativePar2ToJs)').newLine())
                            .editRet(ret => ret.append('nativePar2ToJs(').append(nativeRet).append(')')),
                    }),
                }],
        })

        const actualFuncCallNativeIniret = generator.getJsFuncCallWithNativeIniRet('__jsFunc')

        t.expectCode(actualFuncCallNativeIniret.initializationCode,
            'init(nativePar1ToJs)',
            'init(nativePar2ToJs)',
            'init(jsToNative)',
            '')

        t.expectCode(actualFuncCallNativeIniret.returningCode,
            'jsToNative(Bjs.get.funcCall(__jsFunc, nativePar1ToJs($0), nativePar2ToJs($1)))')
    })

    test('getNativeIniRet', () => {
        const generator = new SwiftLambdaTypeGenerator({
            returnType: {
                getSwiftGenerator: () => ({
                    getNativeReturnStatement: () => 'return ',
                }),
            },
        })

        generator.getCallerWithNativeIniRet = t.mockFn(() => IniRet.create()
            .editIni(ini => ini.append('init(returningNative)').newLine())
            .editRet(ret => ret.append('returningNative()')))


        const nativeIniRet = generator.getNativeIniRet(IniRet.create()
            .editIni(ini => ini.append('jsFuncInit()').newLine())
            .editRet(ret => ret.append('returningJsFunc()')))

        expect(generator.getJsFuncCallWithNativeIniRet).toBeCalledWith('__jsFunc')

        t.expectCode(nativeIniRet.initializationCode,
            'jsFuncInit()',
            'let __jsFunc = returningJsFunc()',
            '')

        t.expectCode(nativeIniRet.returningCode,
            'Bjs.get.getFunc(__jsFunc) {',
            '    init(returningNative)',
            '    return returningNative()',
            '}',
        )
    })

    test('getCallerWithJsIniRet', () => {

    })
})