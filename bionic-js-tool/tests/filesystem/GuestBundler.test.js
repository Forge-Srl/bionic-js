const t = require('../test-utils')

describe('GuestBundler', () => {

    let GuestBundler, GuestFile

    beforeEach(() => {
        t.resetModulesCache()
        GuestBundler = t.requireModule('filesystem/GuestBundler').GuestBundler
        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
    })

    function getSourceFile(path, content) {
        return {path, getSourceFileContent: async () => content}
    }

    test('saveSourceFile', async () => {
        const guestBundler = new GuestBundler()
        const file1Path = '/dir1/dir2/file1.js'
        await guestBundler.saveSourceFile(getSourceFile(file1Path, 'file1 content'))

        const file2Path = '/dir1/file2.js'
        await guestBundler.saveSourceFile(getSourceFile(file2Path, 'file2 content'))

        expect((await guestBundler.inputFs.promises.readFile(file1Path)).toString()).toBe(('file1 content'))
        expect((await guestBundler.inputFs.promises.readFile(file2Path)).toString()).toBe(('file2 content'))
    })

    test('saveSourceFile, write error', async () => {
        const guestBundler = new GuestBundler()
        await expect(guestBundler.saveSourceFile(getSourceFile('..', ''))).rejects.toThrow('error writing file ".." to a virtual filesystem')
    })

    test('generateSourceFiles', async () => {
        t.resetModulesCache()
        const {FileWalker} = t.mockAndRequireModule('filesystem/FileWalker')
        const {SourceFile} = t.mockAndRequireModule('filesystem/SourceFile')
        const {BjsNativeObjectSourceFile} = t.mockAndRequireModule('filesystem/BjsNativeObjectSourceFile')
        const {PackageSourceFile} = t.mockAndRequireModule('filesystem/PackageSourceFile')
        const {BjsIndexSourceFile} = t.mockAndRequireModule('filesystem/BjsIndexSourceFile')
        const {GuestBundler} = t.requireModule('filesystem/GuestBundler')

        const annotatedFile1 = {guestFile: {path: '/path/file1.js', bundles: ['Bundle1', 'Bundle2']}}
        const annotatedFile2 = {guestFile: {path: '/path/file2.js', bundles: ['Bundle2']}}
        const guestDirPath = '/guest/dir'
        const bundler = GuestBundler.build([annotatedFile1, annotatedFile2], {guestDirPath})

        const packageFile2 = {path: '/path/file3.js'}
        const packageWalker = {
            getFiles: async () => [
                {path: '/path/file1.js'},
                packageFile2,
            ],
        }
        FileWalker.mockImplementationOnce((dirPath, patterns) => {
            expect(dirPath).toBe(guestDirPath)
            expect(patterns).toEqual(['**/*.json', '**/*.js', '**/*.mjs'])
            return packageWalker
        })
        SourceFile.build = t.mockFn().mockImplementationOnce((annotatedFile) => {
            expect(annotatedFile).toBe(annotatedFile1)
            return 'annotatedFile1'
        }).mockImplementationOnce((annotatedFile) => {
            expect(annotatedFile).toBe(annotatedFile2)
            return 'annotatedFile2'
        })
        BjsNativeObjectSourceFile.build = t.mockFn().mockImplementationOnce((guestDirPath) => {
            expect(guestDirPath).toBe(guestDirPath)
            return 'nativeObjectSourceFile'
        })
        PackageSourceFile.build = t.mockFn().mockImplementationOnce((packageFile) => {
            expect(packageFile).toBe(packageFile2)
            return 'packageSourceFile'
        })
        const bjsIndexFile1 = {path: 'entry1.js'}
        const bjsIndexFile2 = {path: 'entry2.js'}
        BjsIndexSourceFile.build = t.mockFn().mockImplementationOnce((annotatedFiles, bundleName, guestPath) => {
            expect(annotatedFiles).toEqual([annotatedFile1])
            expect(bundleName).toBe('Bundle1')
            expect(guestPath).toBe(guestDirPath)
            return bjsIndexFile1
        }).mockImplementationOnce((annotatedFiles, bundleName, guestPath) => {
            expect(annotatedFiles).toEqual([annotatedFile1, annotatedFile2])
            expect(bundleName).toBe('Bundle2')
            expect(guestPath).toBe(guestDirPath)
            return bjsIndexFile2
        })

        const savedSourceFiles = []
        bundler.saveSourceFile = async fileToSave => {
            savedSourceFiles.push(fileToSave)
        }
        const entryPaths = await bundler.generateSourceFiles()

        expect(entryPaths).toEqual({
            Bundle1: './entry1.js',
            Bundle2: './entry2.js',
        })
        expect(savedSourceFiles).toEqual(['annotatedFile1', 'annotatedFile2', 'nativeObjectSourceFile',
            'packageSourceFile', bjsIndexFile1, bjsIndexFile2])
    })

    test('makeBundles', async () => {
        const bundler = GuestBundler.build(undefined, {
            outputMode: 'production',
            guestDirPath: '/guest/dir',
        })
        bundler.generateSourceFiles = async () => {
            await bundler.saveSourceFile(getSourceFile('/guest/dir/file1.js', 'modules.export = () => "Hello from bundle1"'))
            await bundler.saveSourceFile(getSourceFile('/guest/dir/file2.js', 'modules.export = () => {return "Hello from " + "bundle2"}'))
            await bundler.saveSourceFile(getSourceFile('/guest/dir/file3.js', 'modules.export = {file1:require("./file1"), file2:require("./file2")}'))
            return {bundle1: './file1.js', bundle2: './file2.js', bundle3: './file3.js'}
        }

        const bundles = await bundler.makeBundles()
        expect(bundles.map(bundle => bundle.name)).toEqual(['bundle1', 'bundle2', 'bundle3'])

        const file1ProductionBundle = 'modules.export=()=>"Hello from bundle1"'
        expect(bundles[0].content).toContain(file1ProductionBundle)

        const file2ProductionBundle = 'modules.export=()=>"Hello from bundle2"'
        expect(bundles[1].content).toContain(file2ProductionBundle)

        expect(bundles[2].content).toContain(file1ProductionBundle)
        expect(bundles[2].content).toContain(file2ProductionBundle)
    })
})