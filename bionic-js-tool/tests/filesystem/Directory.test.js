const t = require('../test-utils')
const {getTempDirPath} = require('./tempDir')

describe('Directory', () => {

    let File, dirPath, directory, Directory

    beforeEach(() => {
        t.resetModulesCache()

        Directory = t.requireModule('filesystem/Directory').Directory
        dirPath = '/dir1/dir2/dir3'
        directory = new Directory(dirPath, '/dir1')

        File = t.requireModule('filesystem/File').File
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

    test('ensureExists, exists, delete', async () => {
        const tempDir = new Directory(getTempDirPath())
        expect(await tempDir.exists()).toBe(false)
        await tempDir.ensureExists()
        expect(await tempDir.exists()).toBe(true)

        const file1 = tempDir.getSubFile('file1.txt')
        expect(await file1.exists()).toBe(false)
        await file1.setContent('file1')
        expect(await file1.exists()).toBe(true)
        expect(await file1.getContent()).toBe('file1')

        const subDir = tempDir.getSubDir('subDir')
        expect(await subDir.exists()).toBe(false)
        await subDir.ensureExists()
        expect(await subDir.exists()).toBe(true)

        const file2 = subDir.getSubFile('file2.txt')
        expect(await file2.exists()).toBe(false)
        await file2.setContent('file2')
        expect(await file2.exists()).toBe(true)
        expect(await file2.getContent()).toBe('file2')

        await tempDir.delete()
        expect(await tempDir.exists()).toBe(false)
        expect(await file1.exists()).toBe(false)
        expect(await subDir.exists()).toBe(false)
        expect(await file2.exists()).toBe(false)
    })
})