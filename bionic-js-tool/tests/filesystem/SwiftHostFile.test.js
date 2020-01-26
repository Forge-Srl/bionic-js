const t = require('../test-utils')

describe('SwiftHostFile', () => {

    const File = t.requireModule('filesystem/File').File
    const ExportedFile = t.requireModule('filesystem/ExportedFile').ExportedFile
    const SwiftHostFile = t.requireModule('filesystem/SwiftHostFile').SwiftHostFile
    const guestFile = new File('/guest/dir/files/code.js', '/guest/dir')
    const exportedFile = new ExportedFile(guestFile)

    test('build native file', () => {
        guestFile.isNative = true
        const swiftHostFile = SwiftHostFile.build(exportedFile, {hostDirPath:'/host/dir'})

        expect(swiftHostFile.path).toBe('/host/dir/files/codeWrapper.swift')
        expect(swiftHostFile.rootDirPath).toBe('/host/dir')
        expect(swiftHostFile.exportedFile).toBe(exportedFile)
    })

    test('build hosted file', () => {
        guestFile.isNative = false
        const swiftHostFile = SwiftHostFile.build(exportedFile, {hostDirPath:'/host/dir'})

        expect(swiftHostFile.path).toBe('/host/dir/files/code.swift')
        expect(swiftHostFile.rootDirPath).toBe('/host/dir')
        expect(swiftHostFile.exportedFile).toBe(exportedFile)
    })
})