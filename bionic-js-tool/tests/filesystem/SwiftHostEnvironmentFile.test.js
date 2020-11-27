const t = require('../test-utils')

describe('SwiftHostEnvironmentFile', () => {

    let Directory

    beforeEach(() => {
        t.resetModulesCache()
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    const getSwiftHostEnvironmentFile = () => t.requireModule('filesystem/SwiftHostEnvironmentFile').SwiftHostEnvironmentFile

    test('build', () => {
        const SwiftHostEnvironmentFile = getSwiftHostEnvironmentFile()
        const nativeFiles = 'nativeFiles'
        const hostProjectConfig = {
            hostDir: new Directory('/host/dir/path', '/'),
        }
        const swiftHostEnvironmentFile = SwiftHostEnvironmentFile.build(nativeFiles, 'Bundle1', hostProjectConfig, 'Project1')

        expect(swiftHostEnvironmentFile.path).toBe('/host/dir/path/BjsBundle1/BjsProject1.swift')
        expect(swiftHostEnvironmentFile.rootDirPath).toBe('/host/dir/path')
        expect(swiftHostEnvironmentFile.bundleName).toBe('Bundle1')
        expect(swiftHostEnvironmentFile.nativeFiles).toBe(nativeFiles)
        expect(swiftHostEnvironmentFile.projectName).toBe('Project1')

    })

    test('generate', async () => {
        const {SwiftHostEnvironmentFileGenerator} = t.mockAndRequireModule('generation/swift/SwiftHostEnvironmentFileGenerator')
        const SwiftHostEnvironmentFile = getSwiftHostEnvironmentFile()

        SwiftHostEnvironmentFileGenerator.mockImplementationOnce((bundleName, nativeFiles, projectName) => {
            expect(bundleName).toBe('Bundle1')
            expect(nativeFiles).toBe('nativeFiles')
            expect(projectName).toBe('Project1')
            return {getSource: () => 'source code'}
        })

        const hostProject = {setHostFileContent: t.mockFn()} // path, hostDirPath, bundleName, nativeFiles, projectName
        const hostEnvironmentFile = new SwiftHostEnvironmentFile('/host/dir/rel/path', '/host/dir', 'Bundle1',
            'nativeFiles', 'Project1')
        await hostEnvironmentFile.generate(hostProject)

        expect(hostProject.setHostFileContent).toBeCalledWith('rel/path', ['Bundle1'], 'source code')
    })
})