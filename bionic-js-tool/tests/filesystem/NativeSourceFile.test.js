const t = require('../test-utils')

describe('NativeSourceFile', () => {

    let NativeSourceFile

    beforeEach(() => {
        NativeSourceFile = t.requireModule('filesystem/NativeSourceFile').NativeSourceFile
    })

    test('getSourceFileContent', async () => {
        const annotatedFile = {
            schema: {
                generator: {
                    forWrapping: () => ({
                        javascript: {
                            getSource: async () => 'source file content',
                        },
                    }),
                },
            },
        }
        const nativeSourceFile = new NativeSourceFile(annotatedFile)
        const sourceFileContent = await nativeSourceFile.getSourceFileContent()

        await expect(sourceFileContent).toBe('source file content')
    })

    test('getSourceFileContent, error', async () => {
        const annotatedFile = {
            guestFile: {
                relativePath: 'guest/path',
            },
            schema: {
                generator: {
                    forWrapping: () => ({
                        javascript: {
                            getSource: () => {
                                throw new Error('generator error')
                            },
                        },
                    }),
                },
            },
        }
        const nativeSourceFile = new NativeSourceFile(annotatedFile)

        await expect(nativeSourceFile.getSourceFileContent()).rejects
            .toThrow('generating source code from guest file "guest/path"\ngenerator error')
    })
})