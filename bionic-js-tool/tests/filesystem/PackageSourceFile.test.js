const t = require('../test-utils')

describe('PackageSourceFile', () => {

    let sourceFile

    beforeEach(() => {
        const PackageSourceFile = t.requireModule('filesystem/PackageSourceFile').PackageSourceFile
        sourceFile = PackageSourceFile.build({
            path: '/path/to/package.json',
            getCodeContent: async () => 'package source file content',
        })
    })

    test('path', () => {
        expect(sourceFile.path).toBe('/path/to/package.json')
    })

    test('getSourceFileContent', async () => {
        t.expectCode(await sourceFile.getSourceFileContent(),
            'package source file content')
    })
})