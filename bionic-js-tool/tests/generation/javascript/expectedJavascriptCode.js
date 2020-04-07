const t = require('../../test-utils')

function getNativeObjectSchema() {
    const NativeObjectClass = t.requireModule('schema/notable/NativeObjectClass').NativeObjectClass
    return new NativeObjectClass('native/BjsNativeObject')
}

function getExpectedHeader(superclassName = 'BjsNativeObject', superclassPath = '../BjsNativeObject',
                           addBottomEmptyLine = true) {
    return [
        `const {${superclassName}} = require(\'${superclassPath}\')`,
        'const {bjsNative} = require(\'Class1\')',
        '',
        `class Class1 extends ${superclassName} {`,
        '    ',
        '    static get bjsNative() {',
        '        return bjsNative',
        '    }',
        ...(addBottomEmptyLine ? ['    '] : []),
    ]
}

function getExpectedFooter() {
    return [
        '}',
        '',
        'module.exports = {Class1}',
    ]
}

module.exports = {getNativeObjectSchema, getExpectedHeader, getExpectedFooter}