const t = require('../test-utils')

describe('BaseFile', () => {

    let fs, BaseFile, filePath, baseFile, Directory

    beforeEach(() => {
        t.resetModulesCache()

        fs = t.mockAndRequireModule('filesystem/async/fs')
        BaseFile = t.requireModule('filesystem/BaseFile').BaseFile

        filePath = '/dir1/dir2/filePath.js'
        baseFile = new BaseFile(filePath, '/dir1')
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    test('dir', () => {
        const dir = baseFile.dir
        expect(dir).toBeInstanceOf(Directory)
        expect(dir.path).toBe('/dir1/dir2')
    })

    test('name', () => {
        expect(baseFile.name).toBe('filePath')
    })

    test('ext', () => {
        expect(baseFile.ext).toBe('.js')
    })

    test('absolutePath', () => {
        expect(baseFile.absolutePath).toBe(filePath)
    })

    test('relativePath', () => {
        expect(baseFile.relativePath).toBe('dir2/filePath.js')
    })

    test('composeNewPath with new root dir and extension', async () => {
        const result = await baseFile.composeNewPath('/new/root/dir', '.new')
        expect(result).toBe('/new/root/dir/dir2/filePath.new')
    })

    test('composeNewPath with new root dir', async () => {
        const result = await baseFile.composeNewPath('/new/root/dir')
        expect(result).toBe('/new/root/dir/dir2/filePath.js')
    })

    test('exists', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            expect(path).toBe(filePath)
            expect(mode).toBe(fs.orig.constants.F_OK)
        })
        expect(await baseFile.exists()).toBe(true)
    })

    test('exists, not existent', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            throw Error('not existent!')
        })
        expect(await baseFile.exists()).toBe(false)
    })

    test('isReadable', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            expect(path).toBe(filePath)
            expect(mode).toBe(fs.orig.constants.F_OK | fs.orig.constants.R_OK)
        })
        expect(await baseFile.isReadable()).toBe(true)
    })

    test('isReadable, not readable', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            throw Error('not readable!')
        })
        expect(await baseFile.isReadable()).toBe(false)
    })

    test('isReadableAndWritable', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            expect(path).toBe(filePath)
            expect(mode).toBe(fs.orig.constants.F_OK | fs.orig.constants.R_OK | fs.orig.constants.W_OK)
        })
        expect(await baseFile.isReadableAndWritable()).toBe(true)
    })

    test('isReadableAndWritable, not readable nor writable', async () => {
        fs.access.mockImplementationOnce(async (path, mode) => {
            throw Error('not readableAndWriteable!')
        })
        expect(await baseFile.isReadableAndWritable()).toBe(false)
    })
})