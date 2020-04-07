const t = require('../test-utils')

describe('SwiftHostEnvironmentFile', () => {

    beforeEach(() => {
        t.resetModulesCache()
    })

    const getSwiftHostEnvironmentFile = () => t.requireModule('filesystem/SwiftHostEnvironmentFile').SwiftHostEnvironmentFile

    test('build', () => {
        const SwiftHostEnvironmentFile = getSwiftHostEnvironmentFile()
        const nativePackageFiles = 'nativePackageFiles'
        const targetConfig = {
            hostDirPath: '/host/dir/path',
            packageName: 'package.ext',
        }
        const swiftHostEnvironmentFile = SwiftHostEnvironmentFile.build(nativePackageFiles, targetConfig)

        expect(swiftHostEnvironmentFile.path).toBe('/host/dir/path/BjsEnvironment.swift')
        expect(swiftHostEnvironmentFile.rootDirPath).toBe('/host/dir/path')
        expect(swiftHostEnvironmentFile.packageName).toBe('package')
        expect(swiftHostEnvironmentFile.nativePackageFiles).toBe(nativePackageFiles)

    })

    test('generate', async () => {
        const {SwiftHostEnvironmentFileGenerator} = t.mockAndRequireModule('generation/swift/SwiftHostEnvironmentFileGenerator')
        const SwiftHostEnvironmentFile = getSwiftHostEnvironmentFile()

        SwiftHostEnvironmentFileGenerator.mockImplementationOnce((packageName, nativePackageFiles) => {
            expect(packageName).toBe('packageName')
            expect(nativePackageFiles).toBe('nativePackageFiles')
            return {getSource: () => 'source code'}
        })

        const hostProject = {setHostFileContent: t.mockFn()}
        const hostEnvironmentFile = new SwiftHostEnvironmentFile('/host/dir/rel/path', '/host/dir', 'packageName', 'nativePackageFiles')
        await hostEnvironmentFile.generate(hostProject)

        expect(hostProject.setHostFileContent).toBeCalledWith('rel/path', 'source code')
    })
})