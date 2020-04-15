const t = require('../test-utils')

describe('Directory', () => {

    let Directory, dirPath, directory, File

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
        await Directory.runInTempDir(async tempDir => {

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

            const workAlsoIfNotExistent = await tempDir.delete()
        })
    })

    test('getFiles, not existing dir', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir1 = tempDir.getSubDir('dir1')
            expect(dir1.getFiles()).rejects.toThrow(new Error(`directory "${dir1.path}" doesn't exists`))
        })
    })

    test('getFiles', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir1 = tempDir.getSubDir('dir1')
            await dir1.ensureExists()

            const files = await dir1.getFiles()
            expect(files).toEqual([])

            const file1 = dir1.getSubFile('file1.txt')
            await file1.setContent('file1')
            const dir2 = dir1.getSubDir('dir2')
            await dir2.ensureExists()
            const file2 = dir2.getSubFile('file2.txt')
            await file2.setContent('file2')

            const dir1Files = await dir1.getFiles()
            expect(dir1Files.length).toBe(2)

            const file1Result = dir1Files.find(file => file.base === 'file1.txt')
            expect(file1Result).toBeInstanceOf(File)
            expect(file1Result.base).toBe('file1.txt')
            expect(await file1Result.getContent()).toBe('file1')

            const dir2Result = dir1Files.find(file => file.base === 'dir2')
            expect(dir2Result).toBeInstanceOf(Directory)
            expect(dir2Result.base).toBe('dir2')

            const dir2Files = await dir2Result.getFiles()
            expect(dir2Files.length).toBe(1)

            const file2Result = dir2Files.find(file => file.base === 'file2.txt')
            expect(file2Result).toBeInstanceOf(File)
            expect(file2Result.base).toBe('file2.txt')
            expect(await file2Result.getContent()).toBe('file2')
        })
    })

    test('cleanEmptyDirs, not existing dir', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir1 = tempDir.getSubDir('dir1')
            await dir1.cleanEmptyDirs()

            expect(await dir1.exists()).toBe(false)
        })
    })

    test('cleanEmptyDirs, empty tree', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir = tempDir.getSubDir('dir')
            const dirL = dir.getSubDir('dirL')
            const dirR = dir.getSubDir('dirR')
            const dirRL = dirR.getSubDir('dirRL')

            await dirL.ensureExists()
            await dirRL.ensureExists()

            await dir.cleanEmptyDirs()

            expect(await dir.exists()).toBe(true)
            expect(await dirL.exists()).toBe(false)
            expect(await dirR.exists()).toBe(false)
        })
    })

    test('cleanEmptyDirs, tree with a right leaf file', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir = tempDir.getSubDir('dir')

            const dirL = dir.getSubDir('dirL')
            const dirLL = dirL.getSubDir('dirLL')

            const dirR = dir.getSubDir('dirR')
            const dirRR = dirR.getSubDir('dirRR')

            await dirLL.ensureExists()
            await dirRR.ensureExists()

            const rightFile = dirRR.getSubFile('rightFile')
            await rightFile.setContent('rightFile')

            await dir.cleanEmptyDirs()

            expect(await dirLL.exists()).toBe(false)
            expect(await dirR.exists()).toBe(true)
        })
    })

    test('cleanEmptyDirs, tree with a left leaf file', async () => {
        await Directory.runInTempDir(async tempDir => {
            const dir = tempDir.getSubDir('dir')

            const dirL = dir.getSubDir('dirL')
            const dirLL = dirL.getSubDir('dirLL')

            const dirR = dir.getSubDir('dirR')
            const dirRR = dirR.getSubDir('dirRR')

            await dirLL.ensureExists()
            await dirRR.ensureExists()

            const leftFile = dirLL.getSubFile('leftFile')
            await leftFile.setContent('leftFile')

            await dir.cleanEmptyDirs()

            expect(await dirLL.exists()).toBe(true)
            expect(await dirR.exists()).toBe(false)
        })
    })
})