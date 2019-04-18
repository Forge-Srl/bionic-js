const t = require('../test-utils')

describe('PackageFile', () => {

    test('build', () => {
        const File = t.requireModule('watcher/File')
        const PackageFile = t.requireModule('watcher/PackageFile')

        const guestFile = new File('/guest/dir/files/code.js', '/guest/dir')
        const packageDirPath = '/package/dir'

        const packageFile = PackageFile.build(guestFile, packageDirPath)

        expect(packageFile.path).toBe('/package/dir/files/code.js')
        expect(packageFile.rootDirPath).toBe(packageDirPath)
        expect(packageFile.guestFile).toBe(guestFile)
    })
})