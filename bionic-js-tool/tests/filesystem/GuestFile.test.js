const t = require('../test-utils')

describe('GuestFile', () => {

    let GuestFile, File

    beforeEach(() => {
        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
        File = t.requireModule('filesystem/File').File
    })

    const cases = [
        {path: '/dir1/file.js', isExportable: true, isNative: false},
        {path: '/dir1\\file.js', isExportable: true, isNative: false},
        {path: '/dir1/sub1/file.js', isExportable: true, isNative: false},
        {path: '/dir1/native/file.js', isExportable: true, isNative: true},
        {path: '/dir1/native/sub1/file.js', isExportable: true, isNative: true},
        {path: '/dir1/file.json', isExportable: false, isNative: false},
        {path: '/dir1/native/file.json', isExportable: false, isNative: false},
        {path: '/dir1/sub1/file.json', isExportable: false, isNative: false},
        {path: '/dir1/file', isExportable: false, isNative: false},
        {path: '/dir1/node_modules.js', isExportable: true, isNative: false},
        {path: '/dir1/node_modules', isExportable: false, isNative: false},
        {path: '/dir1/node_modules/file.js', isExportable: false, isNative: false},
        {path: '/dir1/node_modules/lib1/file.js', isExportable: false, isNative: false},
        {path: '/dir1/node_modules/lib1', isExportable: false, isNative: false},
        {path: '/dir1\\node_modules\\lib1', isExportable: false, isNative: false},
    ]

    for (const testCase of cases) {
        test(testCase.path, () => {

            const file = new File(testCase.path, '/dir1')
            const guestFile = GuestFile.fromFile(file, '/dir1/native')
            expect(guestFile.isExportable).toBe(testCase.isExportable)
            expect(guestFile.isNative).toBe(testCase.isNative)
        })
    }
})