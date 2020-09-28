const t = require('../test-utils')

describe('GuestFile', () => {

    let GuestFile, File

    beforeEach(() => {
        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
        File = t.requireModule('filesystem/File').File
    })

    const cases = [
        {path: '/dir1/file.js', isJavascript: true, isExportable: true},
        {path: '/dir1\\file.js', isJavascript: true, isExportable: true},
        {path: '/dir1/sub1/file.js', isJavascript: true, isExportable: true},
        {path: '/dir1/file.json', isJavascript: false, isExportable: false},
        {path: '/dir1/sub1/file.json', isJavascript: false, isExportable: false},
        {path: '/dir1/file', isJavascript: false, isExportable: false},
        {path: '/dir1/node_modules.js', isJavascript: true, isExportable: true},
        {path: '/dir1/node_modules', isJavascript: false, isExportable: false},
        {path: '/dir1/node_modules/file.js', isJavascript: true, isExportable: false},
        {path: '/dir1/node_modules/lib1/file.js', isJavascript: true, isExportable: false},
        {path: '/dir1/node_modules/lib1', isJavascript: false, isExportable: false},
        {path: '/dir1\\node_modules\\lib1', isJavascript: false, isExportable: false},
    ]

    for (const testCase of cases) {
        test(testCase.path, () => {

            const file = new File(testCase.path, '/dir1')
            const guestFile = GuestFile.fromFile(file, '/dir1/native')
            expect(guestFile.isJavascript).toBe(testCase.isJavascript)
            expect(guestFile.isExportable).toBe(testCase.isExportable)
        })
    }
})