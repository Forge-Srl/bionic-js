const t = require('../test-utils')

describe('ExportedFile', () => {

    let ExportedFile

    beforeEach(() => {
        ExportedFile = t.requireModule('filesystem/ExportedFile').ExportedFile
    })

    test('constructor', () => {
        const exportedFile = new ExportedFile('guestFile', 'schema')

        expect(exportedFile.guestFile).toBe('guestFile')
        expect(exportedFile.schema).toBe('schema')
    })

    test('requiresHostFile, with schema', () => {
        const exportedFile = new ExportedFile(undefined, 'schema')
        expect(exportedFile.requiresHostFile).toBe(true)
    })

    test('requiresHostFile, without schema', () => {
        const exportedFile = new ExportedFile(undefined)
        expect(exportedFile.requiresHostFile).toBe(false)
    })

    const requiresNativePackageFileCases = [
        {requiresHostFile: true, nativeGuestFile: true, expectedValue: true},
        {requiresHostFile: false, nativeGuestFile: true, expectedValue: false},
        {requiresHostFile: true, nativeGuestFile: false, expectedValue: false},
        {requiresHostFile: false, nativeGuestFile: false, expectedValue: false},
    ]

    for (const testCase of requiresNativePackageFileCases) {
        test('requiresNativePackageFile, requires host file: ' + testCase.requiresHostFile + ', native guest file: ' +
            testCase.nativeGuestFile,
            () => {
                const exportedFile = new ExportedFile({isNative: testCase.nativeGuestFile})
                t.mockGetter(exportedFile, 'requiresHostFile', () => testCase.requiresHostFile)
                expect(exportedFile.requiresNativePackageFile).toBe(testCase.expectedValue)
            })
    }
})