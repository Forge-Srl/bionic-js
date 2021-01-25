const t = require('../test-utils')

describe('BjsIndexSourceFile', () => {

    let sourceFile

    beforeEach(() => {
        const BjsIndexSourceFile = t.requireModule('filesystem/BjsIndexSourceFile').BjsIndexSourceFile
        sourceFile = BjsIndexSourceFile.build([
            {exportsClass: true, guestFile: {relativePath: 'File1.js', name: 'File1'}},
            {exportsClass: false},
            {exportsClass: true, guestFile: {relativePath: 'path/to/File2.js', name: 'File2'}},
        ], 'Bundle1', `${t.fsRoot}guest/dir/path`)
    })

    test('getSourceFileContent', async () => {
        expect(sourceFile.path).toBe(`${t.fsRoot}guest/dir/path/Bundle1BjsIndex.js`)
    })

    test('getSourceFileContent', async () => {
        t.expectCode(await sourceFile.getSourceFileContent(),
            'bjsSetModuleLoader(moduleName => {',
            '    switch (moduleName) {',
            '        case \'File1\': return require(\'./File1.js\')',
            '        case \'File2\': return require(\'./path/to/File2.js\')',
            '    }',
            '})')
    })
})