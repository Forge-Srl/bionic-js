const t = require('../test-utils')
const {getTempDirPath, getTempFilePath} = require('./tempDir')

describe('File', () => {

    let fs, crypto, File, filePath, file

    beforeEach(() => {
        t.resetModulesCache()

        fs = t.mockAndRequireModule('filesystem/async/fs')
        crypto = t.mockAndRequire('crypto')
        File = t.requireModule('filesystem/File').File

        filePath = '/dir1/dir2/filePath.js'
        file = new File(filePath, '/dir1')
    })

    test('getContent', async () => {
        fs.readFile.mockImplementationOnce(async () => {
            return 'ok'
        })

        const result = await file.getContent()
        expect(result).toBe('ok')
        expect(fs.readFile).toBeCalledWith(filePath, 'utf8')
    })

    test('getContent, error', async () => {
        fs.readFile.mockImplementationOnce(async () => {
            throw new Error('inner error')
        })

        await expect(file.getContent()).rejects.toThrow('reading the file "/dir1/dir2/filePath.js"\ninner error')
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
        t.resetModulesCache()

        jest.unmock('crypto')
        const File = t.requireModule('filesystem/file').File
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

    test('delete', async () => {
        t.resetModulesCache()

        t.requireModule('filesystem/async/fs')
        const File = t.requireModule('filesystem/file').File
        const file = new File(getTempFilePath(getTempDirPath(true), 'tempFile.txt'))
        expect(await file.exists()).toBe(false)
        await file.setContent('fileContent')
        expect(await file.exists()).toBe(true)
    })
})