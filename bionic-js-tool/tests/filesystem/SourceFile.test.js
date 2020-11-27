const t = require('../test-utils')

describe('SourceFile', () => {

    let SourceFile, StandardSourceFile, NativeSourceFile

    beforeEach(() => {
        SourceFile = t.requireModule('filesystem/SourceFile').SourceFile
        StandardSourceFile = t.requireModule('filesystem/StandardSourceFile').StandardSourceFile
        NativeSourceFile = t.requireModule('filesystem/NativeSourceFile').NativeSourceFile
    })

    const getSourceFile = (exportsNativeClass) => {
        const annotatedFile = {
            exportsNativeClass,
            guestFile: {
                path: '/path/to/file.js',
            },
        }
        return SourceFile.build(annotatedFile)
    }

    test('build standard package file', () => {
        const sourceFile = getSourceFile(false)
        expect(sourceFile).toBeInstanceOf(StandardSourceFile)
        expect(sourceFile.path).toBe('/path/to/file.js')
    })

    test('build standard native file', () => {
        const sourceFile = getSourceFile(true)
        expect(sourceFile).toBeInstanceOf(NativeSourceFile)
        expect(sourceFile.path).toBe('/path/to/file.js')
    })
})