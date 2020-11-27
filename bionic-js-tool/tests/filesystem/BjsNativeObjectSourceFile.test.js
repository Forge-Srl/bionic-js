const t = require('../test-utils')

describe('BjsNativeObjectSourceFile', () => {

    let sourceFile

    beforeEach(() => {
        const BjsNativeObjectSourceFile = t.requireModule('filesystem/BjsNativeObjectSourceFile').BjsNativeObjectSourceFile
        sourceFile = BjsNativeObjectSourceFile.build('/guest/path')

    })

    test('path', async () => {
        expect(sourceFile.path).toBe('/guest/path/BjsNativeObject.js')
    })

    test('getSourceFileContent', async () => {
        t.expectCode(await sourceFile.getSourceFileContent(),
            'class BjsNativeObject {',
            '',
            '    constructor(...params) {',
            '        this.constructor.bjsNative.bjsBind(this, ...params)',
            '    }',
            '}',
            '',
            'module.exports = {BjsNativeObject}')
    })
})