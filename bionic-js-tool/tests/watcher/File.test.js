const t = require('../test-utils')

describe('File', () => {

    let fs, crypto, File, filePath, file, Directory

    beforeEach(() => {
        t.resetModulesCache()

        fs = t.mockAndRequireModule('watcher/async/fs')
        crypto = t.mockAndRequire('crypto')
        File = t.requireModule('watcher/File').File
        filePath = '/dir1/dir2/filePath.js'
        file = new File(filePath, '/dir1')
        Directory = t.requireModule('watcher/Directory').Directory
    })

    test('dir', () => {
        const dir = file.dir
        expect(dir).toBeInstanceOf(Directory)
        expect(dir.path).toBe('/dir1/dir2')
    })

    test('name', () => {
        expect(file.name).toBe('filePath')
    })

    test('ext', () => {
        expect(file.ext).toBe('.js')
    })

    test('relativePath', () => {
        expect(file.relativePath).toBe('dir2/filePath.js')
    })

    test('composeNewPath with new root dir and extension', async () => {

        const result = await file.composeNewPath('/new/root/dir', '.new')
        expect(result).toBe('/new/root/dir/dir2/filePath.new')
    })

    test('composeNewPath with new root dir', async () => {

        const result = await file.composeNewPath('/new/root/dir')
        expect(result).toBe('/new/root/dir/dir2/filePath.js')
    })

    test('getContent', async () => {

        fs.readFile.mockImplementationOnce(async () => {
            return 'ok'
        })

        const result = await file.getContent()
        expect(result).toBe('ok')
        expect(fs.readFile).toBeCalledWith(filePath, 'utf8')
    })

    test('setContent', async () => {

        fs.writeFile.mockImplementationOnce(async () => {
        })

        await file.setContent('content')
        expect(fs.writeFile).toBeCalledWith(filePath, 'content', 'utf8')
    })

    test('getHash', async () => {

        file.getContent = t.mockFn(async () => 'content')
        const digest = t.mockFn(() => 'digest')
        const update = t.mockFn(() => ({digest}))
        crypto.createHash.mockImplementationOnce(() => ({update}))

        const result = await file.getHash()

        expect(file.getContent).toBeCalledWith()
        expect(crypto.createHash).toBeCalledWith('sha256')
        expect(update).toBeCalledWith('content')
        expect(digest).toBeCalledWith('hex')

        expect(result).toBe('digest')
    })

    test('getHash real hashes', async () => {

        jest.unmock('crypto')
        const File = t.requireModule('watcher/file').File
        const file = new File()

        file.getContent = t.mockFn()
            .mockImplementationOnce(async () => 'content1')
            .mockImplementationOnce(async () => 'content2')
            .mockImplementationOnce(async () => 'content1')

        const result1 = await file.getHash()
        const result2 = await file.getHash()
        const result3 = await file.getHash()

        expect(result1).not.toBe(result2)
        expect(result1).toBe(result3)

        expect(file.getContent).toBeCalledTimes(3)
    })
})