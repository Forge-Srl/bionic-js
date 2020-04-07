const t = require('../../test-utils')

describe('JavascriptWrapperMethodGenerator', () => {

    let Class, Method, Parameter, intType, voidType, nativeObjectSchema, expectedHeader, expectedFooter

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Method = t.requireModule('schema/Method').Method
        Parameter = t.requireModule('schema/Parameter').Parameter

        const IntType = t.requireModule('schema/types/IntType').IntType
        intType = new IntType()

        const VoidType = t.requireModule('schema/types/VoidType').VoidType
        voidType = new VoidType()

        const expectedJavascriptCode = require('./expectedJavascriptCode')
        nativeObjectSchema = expectedJavascriptCode.getNativeObjectSchema()
        expectedHeader = expectedJavascriptCode.getExpectedHeader()
        expectedFooter = expectedJavascriptCode.getExpectedFooter()
    })

    function getSchema(isMethodStatic, isMethodOverriding, parameterNames, returnType) {
        return new Class('Class1', '', [], [], [
            new Method('method1', 'method description', isMethodStatic, isMethodOverriding, returnType,
                parameterNames.map(name => new Parameter(intType, name, `${name} desc`))),
        ], nativeObjectSchema, 'native/path')
    }

    function expectMethodCode(isMethodStatic, parameterNames, returnType, expectedCode) {
        const schema = getSchema(isMethodStatic, false, parameterNames, returnType)
        const code = schema.generator.forWrapping().javascript.getSource()
        t.expectCode(code, ...expectedCode)

        const schemaWithOverriding = getSchema(isMethodStatic, true, parameterNames, returnType)
        const codeWithOverriding = schemaWithOverriding.generator.forWrapping().javascript.getSource()
        t.expectCode(codeWithOverriding, ...expectedCode)
    }

    test('Void static method, no params', () => {
        expectMethodCode(true, [], voidType, [
            ...expectedHeader,
            '    static method1() {',
            '        bjsNative.bjsStatic_method1()',
            '    }',
            ...expectedFooter,
        ])
    })

    test('Void static method', () => {
        expectMethodCode(true, ['par1', 'par2'], voidType, [
            ...expectedHeader,
            '    static method1(par1, par2) {',
            '        bjsNative.bjsStatic_method1(par1, par2)',
            '    }',
            ...expectedFooter])
    })

    test('Non void static method', () => {
        expectMethodCode(true, ['par1'], intType, [
            ...expectedHeader,
            '    static method1(par1) {',
            '        return bjsNative.bjsStatic_method1(par1)',
            '    }',
            ...expectedFooter,
        ])
    })

    test('Void method, no params', () => {
        expectMethodCode(false, [], voidType, [
            ...expectedHeader,
            '    method1() {',
            '        bjsNative.bjs_method1(this)',
            '    }',
            ...expectedFooter,
        ])
    })

    test('Void method', () => {
        expectMethodCode(false, ['par1', 'par2'], voidType, [
            ...expectedHeader,
            '    method1(par1, par2) {',
            '        bjsNative.bjs_method1(this, par1, par2)',
            '    }',
            ...expectedFooter,
        ])
    })

    test('Non void method', () => {
        expectMethodCode(false, ['par1'], intType, [
            ...expectedHeader,
            '    method1(par1) {',
            '        return bjsNative.bjs_method1(this, par1)',
            '    }',
            ...expectedFooter,
        ])
    })
})