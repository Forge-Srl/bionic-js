const t = require('../test-utils')

describe('GuestFile', () => {

    let GuestFile, File

    beforeEach(() => {
        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
        File = t.requireModule('filesystem/File').File
    })

    const cases = [
        {path: '/dir1/file.js', isJavascript: true},
        {path: '/dir1\\file.js', isJavascript: true},
        {path: '/dir1/sub1/file.js', isJavascript: true},
        {path: '/dir1/file.json', isJavascript: false},
        {path: '/dir1/sub1/file.json', isJavascript: false},
        {path: '/dir1/file', isJavascript: false},
        {path: '/dir1/node_modules.js', isJavascript: true},
        {path: '/dir1/node_modules', isJavascript: false},
        {path: '/dir1/node_modules/file.mjs', isJavascript: true},
        {path: '/dir1/node_modules/lib1/file.js', isJavascript: true},
        {path: '/dir1/node_modules/lib1', isJavascript: false},
        {path: '/dir1\\node_modules\\lib1.c', isJavascript: false},
    ]

    for (const testCase of cases) {
        test(testCase.path, () => {

            const file = new File(testCase.path, '/dir1')
            const guestFile = GuestFile.fromFile(file, ['bundle1'])
            expect(guestFile.isJavascript).toBe(testCase.isJavascript)
            expect(guestFile.path).toBe(testCase.path)
            expect(guestFile.bundles).toEqual(['bundle1'])
        })
    }
})