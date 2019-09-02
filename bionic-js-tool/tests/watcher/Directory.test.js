const t = require('../test-utils')

describe('Directory', () => {

    let File, dirPath, directory, Directory

    beforeEach(() => {
        t.resetModulesCache()

        Directory = t.requireModule('watcher/Directory').Directory
        dirPath = '/dir1/dir2/dir3'
        directory = new Directory(dirPath, '/dir1')

        File = t.requireModule('watcher/File').File
    })

    test('getSubFile', () => {
        const subFile = directory.getSubFile('file1.js')
        expect(subFile).toBeInstanceOf(File)
        expect(subFile.path).toBe('/dir1/dir2/dir3/file1.js')
    })

    test('getSubDir', () => {
        const subDir = directory.getSubDir('dir4')
        expect(subDir).toBeInstanceOf(Directory)
        expect(subDir.path).toBe('/dir1/dir2/dir3/dir4')
    })

    test('getSubPath', () => {
        const subPath = directory.getSubPath('path')
        expect(subPath).toBe('/dir1/dir2/dir3/path')
    })
})