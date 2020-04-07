const t = require('../test-utils')

describe('PackageFile', () => {

    let StandardPackageFile

    beforeEach(() => {
        StandardPackageFile = t.requireModule('filesystem/StandardPackageFile').StandardPackageFile
    })

    test('getPackageContent', async () => {
        const exportedFile = {
            guestFile: {
                getContent: async () => 'packageContent',
            },
        }
        const packageFile = new StandardPackageFile(null, null, exportedFile)
        const packageFileContent = await packageFile.getPackageContent()

        expect(packageFileContent).toBe('packageContent')
    })

    test('getPackageContent, error', async () => {
        const exportedFile = {
            guestFile: {
                getContent: async () => {
                    throw new Error('test error')
                },
                relativePath: 'relative/path',
            },
        }
        const packageFile = new StandardPackageFile(null, null, exportedFile)
        await expect(packageFile.getPackageContent()).rejects.toThrow('reading guest code file "relative/path"')
    })
})