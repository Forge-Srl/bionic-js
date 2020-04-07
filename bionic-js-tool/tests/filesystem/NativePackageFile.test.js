const t = require('../test-utils')

describe('NativePackageFile', () => {

    let NativePackageFile

    beforeEach(() => {
        NativePackageFile = t.requireModule('filesystem/NativePackageFile').NativePackageFile
    })

    test('getPackageContent', async () => {
        const exportedFile = {
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
        const nativePackageFile = new NativePackageFile(null, null, exportedFile)
        const packageContent = await nativePackageFile.getPackageContent()

        await expect(packageContent).toBe('source file content')
    })

    test('getPackageContent, error', async () => {
        const exportedFile = {
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
        const nativePackageFile = new NativePackageFile(null, null, exportedFile)

        await expect(nativePackageFile.getPackageContent()).rejects
            .toThrow('generating native package code from guest file "guest/path"\ngenerator error')
    })
})