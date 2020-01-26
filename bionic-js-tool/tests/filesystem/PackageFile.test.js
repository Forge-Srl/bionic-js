const t = require('../test-utils')

describe('PackageFile', () => {

    test('build', () => {
        const File = t.requireModule('filesystem/File').File
        const ExportedFile = t.requireModule('filesystem/ExportedFile').ExportedFile
        const PackageFile = t.requireModule('filesystem/PackageFile').PackageFile

        const guestFile = new File('/guest/dir/files/code.js', '/guest/dir')
        const exportedFile = new ExportedFile(guestFile)
        const packageDirPath = '/package/dir'

        const packageFile = PackageFile.build(exportedFile, packageDirPath)

        expect(packageFile.path).toBe('/package/dir/files/code.js')
        expect(packageFile.rootDirPath).toBe(packageDirPath)
        expect(packageFile.exportedFile).toBe(exportedFile)
    })
})