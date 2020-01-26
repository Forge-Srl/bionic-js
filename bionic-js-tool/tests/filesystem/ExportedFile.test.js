const t = require('../test-utils')

describe('ExportedFile', () => {

    let ExportedFile

    beforeEach(() => {
        ExportedFile = t.requireModule('filesystem/ExportedFile').ExportedFile
    })

    test('hasSchema', () => {
        const exportedFileNoSchema = new ExportedFile(undefined)
        const exportedFileWithSchema = new ExportedFile(undefined, 'schema')

        expect(exportedFileNoSchema.hasSchema).toBe(false)
        expect(exportedFileWithSchema.hasSchema).toBe(true)
    })

    test('isNative', () => {
        const notNativeExportedFile = new ExportedFile({isNative: false})
        const nativeExportedFile = new ExportedFile({isNative: true})

        expect(notNativeExportedFile.isNative).toBe(false)
        expect(nativeExportedFile.isNative).toBe(true)
    })

    test('isHosted', () => {
        const nativeExportedFile = new ExportedFile({isNative: true}, 'schema')
        const notNativeExportedFileWithSchema = new ExportedFile({isNative: false}, 'schema')
        const notNativeExportedFileWithoutSchema = new ExportedFile({isNative: false}, null)
        const notNativeExportedFileWithoutSchema2 = new ExportedFile({isNative: false})

        expect(nativeExportedFile.isHosted).toBe(false)
        expect(notNativeExportedFileWithSchema.isHosted).toBe(true)
        expect(notNativeExportedFileWithoutSchema.isNative).toBe(false)
        expect(notNativeExportedFileWithoutSchema2.isNative).toBe(false)
    })
})