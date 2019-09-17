const t = require('../test-utils')

describe('GuestFile', () => {

    let GuestFile

    beforeEach(() => {
        t.resetModulesCache()

        GuestFile = t.requireModule('watcher/GuestFile').GuestFile
    })

    const isExportableCases = [
        {path: 'dir1/file.js', hostPath: 'dir1', result: true},
        {path: 'dir1\\file.js', hostPath: 'dir1', result: true},
        {path: 'dir1/sub1/file.js', hostPath: 'dir1', result: true},
        {path: 'dir1/file.json', hostPath: 'dir1', result: false},
        {path: 'dir1/sub1/file.json', hostPath: 'dir1', result: false},
        {path: 'dir1/file', hostPath: 'dir1', result: false},
        {path: 'dir1/node_modules.js', hostPath: 'dir1', result: true},
        {path: 'dir1/node_modules', hostPath: 'dir1', result: false},
        {path: 'dir1/node_modules/file.js', hostPath: 'dir1', result: false},
        {path: 'dir1/node_modules/lib1/file.js', hostPath: 'dir1', result: false},
        {path: 'dir1/node_modules/lib1', hostPath: 'dir1', result: false},
        {path: 'dir1\\node_modules\\lib1', hostPath: 'dir1', result: false},
    ]

    for (const testCase of isExportableCases) {
        test('isExportable ' + testCase.path, () => {

            const guestFile = new GuestFile(testCase.path, testCase.hostPath)
            expect(guestFile.isExportable).toBe(testCase.result)
        })
    }
})