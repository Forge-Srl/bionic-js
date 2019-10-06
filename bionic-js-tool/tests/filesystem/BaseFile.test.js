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

    test('composeNewPath with new root dir, name and extension', async () => {
        const result = await baseFile.composeNewPath('/new/root/dir', 'newName', '.new')
        expect(result).toBe('/new/root/dir/dir2/newName.new')
    })

    test('composeNewPath with new root dir and name', async () => {
        const result = await baseFile.composeNewPath('/new/root/dir', 'newName')
        expect(result).toBe('/new/root/dir/dir2/newName.js')
    })

    test('composeNewPath with new root dir', async () => {
        const result = await baseFile.composeNewPath('/new/root/dir')
        expect(result).toBe('/new/root/dir/dir2/filePath.js')
    })

    const isInsideDirCases = [
        {path: '/dir1', pathSegments: ['/dir1'], result: true},
        {path: '/dir1', pathSegments: ['/dir2'], result: false},
        {path: '/dir1/file.js', pathSegments: ['/dir1'], result: true},
        {path: '/dir1/dir2/file.js', pathSegments: ['/', 'dir1', 'dir2'], result: true},
        {path: '/dir1/dir2/file.js', pathSegments: ['/'], result: true},
        {path: '/dir1/dir2/file.js', pathSegments: ['/', 'dir1', 'dir3'], result: false},
        {path: '/dir1/dir2', pathSegments: ['/dir2'], result: false},
        {path: '/dir1/dir2/../file.js', pathSegments: ['/', 'dir1'], result: true},
        {path: '/dir1/dir2/file.js', pathSegments: ['/', 'dir2', '..', 'dir1'], result: true},
    ]
    for (const testCase of isInsideDirCases) {
        test('isInsideDir ' + testCase.path, () => {
            baseFile = new BaseFile(testCase.path)
            expect(baseFile.isInsideDir(...testCase.pathSegments)).toBe(testCase.result)
        })
    }

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