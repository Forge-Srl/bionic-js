const t = require('../test-utils')

describe('GuestFile', () => {

    let GuestFile

    beforeEach(() => {
        t.resetModulesCache()

        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
    })

    const isExportableCases = [
        {path: 'dir1/file.js', result: true},
        {path: 'dir1\\file.js', result: true},
        {path: 'dir1/sub1/file.js', result: true},
        {path: 'dir1/file.json', result: false},
        {path: 'dir1/sub1/file.json', result: false},
        {path: 'dir1/file', result: false},
        {path: 'dir1/node_modules.js', result: true},
        {path: 'dir1/node_modules', result: false},
        {path: 'dir1/node_modules/file.js', result: false},
        {path: 'dir1/node_modules/lib1/file.js', result: false},
        {path: 'dir1/node_modules/lib1', result: false},
        {path: 'dir1\\node_modules\\lib1', result: false},
    ]

    for (const testCase of isExportableCases) {
        test('isExportable ' + testCase.path, () => {

            const guestFile = new GuestFile(testCase.path, 'dir1')
            expect(guestFile.isExportable).toBe(testCase.result)
        })
    }
})