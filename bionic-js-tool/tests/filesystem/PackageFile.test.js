const t = require('../test-utils')

describe('PackageFile', () => {

    let PackageFile, StandardPackageFile, NativePackageFile

    beforeEach(() => {
        PackageFile = t.requireModule('filesystem/PackageFile').PackageFile
        StandardPackageFile = t.requireModule('filesystem/StandardPackageFile').StandardPackageFile
        NativePackageFile = t.requireModule('filesystem/NativePackageFile').NativePackageFile
    })

    const buildAndTestPackageFile = (requiresNativePackageFile) => {
        const targetConfig = {
            packageDirPath: '/package/dir',
            packageMinimization: true,
        }

        const exportedFile = {
            requiresNativePackageFile,
            guestFile: {
                composeNewPath: (newRootDirPath) => {
                    expect(newRootDirPath).toBe('/package/dir')
                    return '/package/dir/guest/Code.js'
                },
            },
        }

        const packageFile = PackageFile.build(exportedFile, targetConfig)
        expect(packageFile.path).toBe('/package/dir/guest/Code.js')
        expect(packageFile.rootDirPath).toBe('/package/dir')
        expect(packageFile.exportedFile).toBe(exportedFile)
        expect(packageFile.minimization).toBe(true)
        return packageFile
    }

    test('build standard package file', () => {
        const packageFile = buildAndTestPackageFile(false)
        expect(packageFile).toBeInstanceOf(StandardPackageFile)
    })

    test('build standard native file', () => {
        const packageFile = buildAndTestPackageFile(true)
        expect(packageFile).toBeInstanceOf(NativePackageFile)
    })

    test('getPackageContent', async () => {
        const packageFile = new PackageFile()
        await expect(packageFile.getPackageContent()).rejects.toThrow('method "getPackageContent" must be implemented')
    })

    test('processPackage, with minimization and javascript package file', () => {
        const exportedFile = {guestFile: {isJavascript: true}}
        const minimization = true
        const packageFile = new PackageFile(null, null, exportedFile, minimization)
        const packageFileContent = '{const pi = 3.14;res = pi}'

        const processedFileContent = packageFile.processPackage(packageFileContent)
        expect(processedFileContent).toBe('res=3.14;')
    })

    test('processPackage, with minimization and non javascript package file', () => {
        const exportedFile = {guestFile: {isJavascript: false}}
        const minimization = true
        const packageFile = new PackageFile(null, null, exportedFile, minimization)
        const packageFileContent = '{json:"file"}'

        const processedFileContent = packageFile.processPackage(packageFileContent)
        expect(processedFileContent).toBe(packageFileContent)
    })

    test('processPackage, without minimization and javascript package file', () => {
        const exportedFile = {guestFile: {isJavascript: false}}
        const minimization = false
        const packageFile = new PackageFile(null, null, exportedFile, minimization)
        const packageFileContent = '{const pi = 3.14;res = pi}'

        const processedFileContent = packageFile.processPackage(packageFileContent)
        expect(processedFileContent).toBe(packageFileContent)
    })

    test('processPackage, js minimization error', () => {
        const exportedFile = {guestFile: {isJavascript: true, relativePath: 'relative/path'}}
        const minimization = true
        const packageFile = new PackageFile(null, null, exportedFile, minimization)
        const packageFileContent = 'a=3\n\n{  return true}'

        expect(() => packageFile.processPackage(packageFileContent)).toThrow(
            'minimizing guest code file "relative/path"\n' +
            '{"name":"SyntaxError","message":"\'return\' outside of function","filename":"0","line":3,"col":3,"pos":8}')
    })

    test('generate', async () => {
        const packageFile = new PackageFile()
        packageFile.getPackageContent = async () => {
            return 'packageContent'
        }
        packageFile.processPackage = packageContent => {
            expect(packageContent).toBe('packageContent')
            return 'processedContent'
        }
        t.mockGetter(packageFile, 'relativePath', () => '/relative/path')

        const hostProject = {
            setPackageFileContent: t.mockFn((pathRelativeToPackageDir, packageFileContent) => {
                expect(pathRelativeToPackageDir).toBe('/relative/path')
                expect(packageFileContent).toBe('processedContent')
            }),
        }

        await packageFile.generate(hostProject)
        expect(hostProject.setPackageFileContent).toBeCalled()
    })
})