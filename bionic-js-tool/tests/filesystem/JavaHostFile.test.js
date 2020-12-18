const t = require('../test-utils')

describe('JavaHostFile', () => {

    const JavaHostFile = t.requireModule('filesystem/JavaHostFile').JavaHostFile

    function buildTest(isNative, expectedFileName) {
        const annotatedFile = {
            guestFile: {
                name: 'Code',
                composeNewPath: (newRootDirPath, newName, newExtension) => {
                    expect(newRootDirPath).toBe('/host/dir')
                    expect(newName).toBe(expectedFileName)
                    expect(newExtension).toBe('.java')
                    return 'code/file.java'
                },
            },
            schema: {
                isNative: isNative,
            },
        }
        const hostProjectConfig = {
            hostDir: {path: '/host/dir'},
            hostPackage: 'test.java'
        }
        const projectName = 'projectName'
        const javaHostFile = JavaHostFile.build(annotatedFile, hostProjectConfig, projectName)

        expect(javaHostFile).toBeInstanceOf(JavaHostFile)
        expect(javaHostFile.path).toBe('code/file.java')
        expect(javaHostFile.rootDirPath).toBe('/host/dir')
        expect(javaHostFile.annotatedFile).toBe(annotatedFile)
        expect(javaHostFile.projectName).toBe(projectName)
        expect(javaHostFile.basePackage).toBe('test.java')
    }

    test('build native file', () => {
        buildTest(true, 'CodeBjsExport')
    })

    test('build hosted file', () => {
        buildTest(false, 'Code')
    })

    test('generate, for hosting guest file', async () => {
        const annotatedFile = {
            guestFile: {bundles: 'bundles'},
            schema: {
                isNative: false,
                generator: {
                    forHosting: (projectName, basePackage) => {
                        expect(projectName).toBe('Project1')
                        expect(basePackage).toBe('test.java')
                        return {
                            java: {
                                getSource: () => 'hosting code',
                            },
                        }
                    },
                },
            },
        }
        const javaHostFile = new JavaHostFile(null, null, annotatedFile, 'Project1', 'test.java')
        t.mockGetter(javaHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, bundles, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(bundles).toBe('bundles')
                expect(hostFileContent).toBe('hosting code')
            }),
        }

        await javaHostFile.generate(hostProject)
        expect(hostProject.setHostFileContent).toBeCalled()
    })

    test('generate, for wrapping guest file', async () => {
        const annotatedFile = {
            guestFile: {bundles: 'bundles'},
            schema: {
                isNative: true,
                generator: {
                    forHosting: (projectName, basePackage) => {
                        expect(projectName).toBe('Project1')
                        expect(basePackage).toBe('test.java')
                        return {java: 'javaHostClassGenerator'}
                    },
                    forWrapping: (hostGenerator, projectName, basePackage) => {
                        expect(hostGenerator).toBe('javaHostClassGenerator')
                        expect(projectName).toBe('Project1')
                        expect(basePackage).toBe('test.java')
                        return {java: {getSource: () => 'wrapping code'}}
                    },
                },
            },
        }
        const javaHostFile = new JavaHostFile(null, null, annotatedFile, 'Project1', 'test.java')
        t.mockGetter(javaHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, bundles, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(bundles).toBe('bundles')
                expect(hostFileContent).toBe('wrapping code')
            }),
        }

        await javaHostFile.generate(hostProject)
        expect(hostProject.setHostFileContent).toBeCalled()
    })

    test('generate, error', async () => {
        const annotatedFile = {
            guestFile: {
                relativePath: 'guest/path',
            },
            schema: {
                isNative: false,
                generator: {
                    forHosting: () => ({
                        java: {
                            getSource: () => {
                                throw new Error('generator error')
                            },
                        },
                    }),
                },
            },
        }
        const javaHostFile = new JavaHostFile(null, null, annotatedFile)
        await expect(javaHostFile.generate()).rejects
            .toThrow('generating host code from guest file "guest/path"\ngenerator error')
    })
})