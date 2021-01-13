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
            hostDir: (sourceSet) => new Directory(`/host/dir/path/${sourceSet}`, '/'),
            getSourceSetsForBundles: (bundles) => {
                expect(bundles).toStrictEqual(['Bundle1'])
                return ['source1', 'source2']
            },
            hostPackage: 'test.java',
        }
        const javaHostEnvironmentFiles = JavaHostEnvironmentFile.build(nativeFiles, 'Bundle1', hostProjectConfig, 'Project1')
        expect(javaHostEnvironmentFiles.length).toBe(2)
        expect(javaHostEnvironmentFiles[0].path).toBe('/host/dir/path/source1/BjsProject1.java')
        expect(javaHostEnvironmentFiles[0].rootDirPath).toBe('/host/dir/path/source1')
        expect(javaHostEnvironmentFiles[0].bundleName).toBe('Bundle1')
        expect(javaHostEnvironmentFiles[0].nativeFiles).toBe(nativeFiles)
        expect(javaHostEnvironmentFiles[0].projectName).toBe('Project1')
        expect(javaHostEnvironmentFiles[0].basePackage).toBe('test.java')
        expect(javaHostEnvironmentFiles[0].sourceSet).toBe('source1')
        expect(javaHostEnvironmentFiles[1].path).toBe('/host/dir/path/source2/BjsProject1.java')
        expect(javaHostEnvironmentFiles[1].rootDirPath).toBe('/host/dir/path/source2')
        expect(javaHostEnvironmentFiles[1].bundleName).toBe('Bundle1')
        expect(javaHostEnvironmentFiles[1].nativeFiles).toBe(nativeFiles)
        expect(javaHostEnvironmentFiles[1].projectName).toBe('Project1')
        expect(javaHostEnvironmentFiles[1].basePackage).toBe('test.java')
        expect(javaHostEnvironmentFiles[1].sourceSet).toBe('source2')
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
            'nativeFiles', 'Project1', 'test.java', 'sourceSet')
        await hostEnvironmentFile.generate(hostProject)

        expect(hostProject.setHostFileContent).toBeCalledWith('rel/path', ['Bundle1'], 'source code', 'sourceSet')
    })
})