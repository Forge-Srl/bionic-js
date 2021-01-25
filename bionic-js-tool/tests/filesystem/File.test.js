const t = require('../test-utils')

describe('File', () => {

    let fs, crypto, File, filePath, file

    beforeEach(() => {
        t.resetModulesCache()

        fs = t.mockAndRequireModule('filesystem/async/fs')
        crypto = t.mockAndRequire('crypto')
        File = t.requireModule('filesystem/File').File

        filePath = `${t.fsRoot}dir1/dir2/filePath.js`
        file = new File(filePath, `${t.fsRoot}dir1`)
    })

    test('getCodeContent', async () => {
        fs.readFile.mockImplementationOnce(async () => {
            return 'ok'
        })

        const result = await file.getCodeContent()
        expect(result).toBe('ok')
        expect(fs.readFile).toBeCalledWith(filePath, 'utf8')
    })

    test('getCodeContent, windows new line', async () => {
        fs.readFile.mockImplementationOnce(async () => {
            return 'line1\r\nline2\n\rline3'
        })

        const result = await file.getCodeContent()
        expect(result).toBe('line1\nline2\nline3')
        expect(fs.readFile).toBeCalledWith(filePath, 'utf8')
    })

    test('getCodeContent, error', async () => {
        fs.readFile.mockImplementationOnce(async () => {
            throw new Error('inner error')
        })

        await expect(file.getCodeContent()).rejects.toThrow(`reading the file "${t.fsRoot}dir1/dir2/filePath.js"\ninner error`)
    })

    test('setContent', async () => {
        fs.writeFile.mockImplementationOnce(async () => {
        })

        await file.setContent('content')
        expect(fs.writeFile).toBeCalledWith(filePath, 'content', 'utf8')
    })

    test('getHash', async () => {
        file.getCodeContent = t.mockFn(async () => 'content')
        const digest = t.mockFn(() => 'digest')
        const update = t.mockFn(() => ({digest}))
        crypto.createHash.mockImplementationOnce(() => ({update}))

        const result = await file.getHash()

        expect(file.getCodeContent).toBeCalledWith()
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

        file.getCodeContent = t.mockFn()
            .mockImplementationOnce(async () => 'content1')
            .mockImplementationOnce(async () => 'content2')
            .mockImplementationOnce(async () => 'content1')

        const result1 = await file.getHash()
        const result2 = await file.getHash()
        const result3 = await file.getHash()

        expect(result1).not.toBe(result2)
        expect(result1).toBe(result3)

        expect(file.getCodeContent).toBeCalledTimes(3)
    })

    test('exists, delete', async () => {
        t.resetModulesCache()
        jest.unmock('crypto')

        t.requireModule('filesystem/async/fs')
        const Directory = t.requireModule('filesystem/Directory').Directory

        await Directory.runInTempDir(async tempDir => {
            const file = tempDir.getSubFile('tempFile.txt')
            expect(await file.exists()).toBe(false)
            await file.setContent('fileContent')
            expect(await file.exists()).toBe(true)

            expect(await file.delete()).toBe(true)
            expect(await file.exists()).toBe(false)

            expect(await file.delete()).toBe(false)
        })
    })
})