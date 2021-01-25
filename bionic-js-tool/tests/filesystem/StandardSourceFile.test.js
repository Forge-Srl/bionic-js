const t = require('../test-utils')

describe('SourceFile', () => {

    let StandardSourceFile

    beforeEach(() => {
        StandardSourceFile = t.requireModule('filesystem/StandardSourceFile').StandardSourceFile
    })

    test('getSourceFileContent', async () => {
        const annotatedFile = {
            guestFile: {
                getCodeContent: async () => 'sourceFileContent',
            },
        }
        const sourceFile = new StandardSourceFile(annotatedFile)
        const sourceFileContent = await sourceFile.getSourceFileContent()

        expect(sourceFileContent).toBe('sourceFileContent')
    })

    test('getSourceFileContent, error', async () => {
        const annotatedFile = {
            guestFile: {
                getCodeContent: async () => {
                    throw new Error('test error')
                },
                relativePath: 'relative/path',
            },
        }
        const sourceFile = new StandardSourceFile(annotatedFile)
        await expect(sourceFile.getSourceFileContent()).rejects.toThrow('reading guest code file "relative/path"')
    })
})