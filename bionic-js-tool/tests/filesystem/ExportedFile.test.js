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

    test('exportsClass, with schema', () => {
        const exportedFile = new ExportedFile(undefined, 'schema')
        expect(exportedFile.exportsClass).toBe(true)
    })

    test('exportsClass, without schema', () => {
        const exportedFile = new ExportedFile(undefined)
        expect(exportedFile.exportsClass).toBe(false)
    })

    const exportsNativeClassCases = [
        {exportsClass: true, schemaIsNative: true, expectedValue: true},
        {exportsClass: false, schemaIsNative: true, expectedValue: false},
        {exportsClass: true, schemaIsNative: false, expectedValue: false},
        {exportsClass: false, schemaIsNative: false, expectedValue: false},
    ]

    for (const testCase of exportsNativeClassCases) {
        test('exportsNativeClass, requires host file: ' + testCase.exportsClass + ', schema is native: ' +
            testCase.schemaIsNative,
            () => {
                const exportedFile = new ExportedFile(undefined, {isNative: testCase.schemaIsNative})
                t.mockGetter(exportedFile, 'exportsClass', () => testCase.exportsClass)
                expect(exportedFile.exportsNativeClass).toBe(testCase.expectedValue)
            })
    }

    test('resolveClassType, with schema', () => {
        const schema = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedSchema'
            },
        }
        const exportedFile = new ExportedFile('guestFile', schema)
        expect(exportedFile.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new ExportedFile('guestFile', 'resolvedSchema'))
    })

    test('resolveClassType, without schema', () => {
        const exportedFile = new ExportedFile('guestFile', null)

        const actualExportedFile = exportedFile.resolveClassType('nativeClassesMap')
        expect(actualExportedFile).toStrictEqual(exportedFile)
        expect(actualExportedFile).not.toBe(exportedFile)
    })
})