const t = require('../test-utils')

describe('JavaHostEnvironmentFile', () => {

    let Directory

    beforeEach(() => {
        t.resetModulesCache()
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    const getJavaHostEnvironmentFile = () => t.requireModule('filesystem/JavaHostEnvironmentFile').JavaHostEnvironmentFile

    test('build', () => {
        const JavaHostEnvironmentFile = getJavaHostEnvironmentFile()
        const nativeFiles = 'nativeFiles'
        const hostProjectConfig = {
            hostDir: new Directory('/host/dir/path', '/'),
            basePackage: 'test.java',
        }
        const javaHostEnvironmentFile = JavaHostEnvironmentFile.build(nativeFiles, 'Bundle1', hostProjectConfig, 'Project1')

        expect(javaHostEnvironmentFile.path).toBe('/host/dir/path/BjsBundle1/BjsProject1.java')
        expect(javaHostEnvironmentFile.rootDirPath).toBe('/host/dir/path')
        expect(javaHostEnvironmentFile.bundleName).toBe('Bundle1')
        expect(javaHostEnvironmentFile.nativeFiles).toBe(nativeFiles)
        expect(javaHostEnvironmentFile.projectName).toBe('Project1')
        expect(javaHostEnvironmentFile.basePackage).toBe('test.java')
    })

    test('generate', async () => {
        const {JavaHostEnvironmentFileGenerator} = t.mockAndRequireModule('generation/java/JavaHostEnvironmentFileGenerator')
        const JavaHostEnvironmentFile = getJavaHostEnvironmentFile()

        JavaHostEnvironmentFileGenerator.mockImplementationOnce((bundleName, nativeFiles, projectName, javaPackage) => {
            expect(bundleName).toBe('Bundle1')
            expect(nativeFiles).toBe('nativeFiles')
            expect(projectName).toBe('Project1')
            expect(javaPackage).toBe('test.java')
            return {getSource: () => 'source code'}
        })

        const hostProject = {setHostFileContent: t.mockFn()} // path, hostDirPath, bundleName, nativeFiles, projectName
        const hostEnvironmentFile = new JavaHostEnvironmentFile('/host/dir/rel/path', '/host/dir', 'Bundle1',
            'nativeFiles', 'Project1', 'test.java')
        await hostEnvironmentFile.generate(hostProject)

        expect(hostProject.setHostFileContent).toBeCalledWith('rel/path', ['Bundle1'], 'source code')
    })
})