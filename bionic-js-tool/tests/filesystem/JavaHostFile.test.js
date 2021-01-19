const t = require('../test-utils')

describe('JavaHostFile', () => {

    const JavaHostFile = t.requireModule('filesystem/JavaHostFile').JavaHostFile

    function buildTest(isNative, expectedFileName) {
        const annotatedFile = {
            guestFile: {
                name: 'Code',
                bundles: ['bundle1', 'bundle2'],
                composeNewPath: (newRootDirPath, newName, newExtension) => {
                    expect(newRootDirPath.startsWith('/host/dir/source')).toBeTruthy()
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
            hostDir: (sourceSet) => ({path: `/host/dir/${sourceSet}`}),
            getSourceSetsForBundles: (bundles) => {
                expect(bundles).toStrictEqual(['bundle1', 'bundle2'])
                return ['source1', 'source2']
            },
            hostPackage: 'test.java'
        }
        const projectName = 'projectName'
        const javaHostFiles = JavaHostFile.build(annotatedFile, hostProjectConfig, projectName)
        expect(javaHostFiles.length).toBe(2)
        expect(javaHostFiles[0]).toBeInstanceOf(JavaHostFile)
        expect(javaHostFiles[0].path).toBe('code/file.java')
        expect(javaHostFiles[0].rootDirPath).toBe('/host/dir/source1')
        expect(javaHostFiles[0].annotatedFile).toBe(annotatedFile)
        expect(javaHostFiles[0].projectName).toBe(projectName)
        expect(javaHostFiles[0].basePackage).toBe('test.java')
        expect(javaHostFiles[1]).toBeInstanceOf(JavaHostFile)
        expect(javaHostFiles[1].path).toBe('code/file.java')
        expect(javaHostFiles[1].rootDirPath).toBe('/host/dir/source2')
        expect(javaHostFiles[1].annotatedFile).toBe(annotatedFile)
        expect(javaHostFiles[1].projectName).toBe(projectName)
        expect(javaHostFiles[1].basePackage).toBe('test.java')
    }

    test('build native file', () => {
        buildTest(true, 'CodeBjsExport')
    })

    test('build hosted file', () => {
        buildTest(false, 'Code')
    })

    describe('generate', () => {

        test('for hosting guest file', async () => {
            const annotatedFile = {
                guestFile: {bundles: 'bundles'},
                schema: {
                    isNative: false,
                    generator: {
                        forHosting: (projectName, basePackage, allFiles) => {
                            expect(projectName).toBe('Project1')
                            expect(basePackage).toBe('test.java')
                            expect(allFiles).toStrictEqual(['all files'])
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

            await javaHostFile.generate(hostProject, ['all files'])
            expect(hostProject.setHostFileContent).toBeCalled()
        })

        test('for wrapping guest file', async () => {
            const annotatedFile = {
                guestFile: {bundles: 'bundles'},
                schema: {
                    isNative: true,
                    generator: {
                        forHosting: (projectName, basePackage, allFiles) => {
                            expect(projectName).toBe('Project1')
                            expect(basePackage).toBe('test.java')
                            expect(allFiles).toStrictEqual(['all files'])
                            return {java: 'javaHostClassGenerator'}
                        },
                        forWrapping: (hostGenerator, projectName, basePackage, nativePackage, allFiles) => {
                            expect(hostGenerator).toBe('javaHostClassGenerator')
                            expect(projectName).toBe('Project1')
                            expect(basePackage).toBe('test.java')
                            expect(nativePackage).toBe('nativePack')
                            expect(allFiles).toStrictEqual(['all files'])
                            return {java: {getSource: () => 'wrapping code'}}
                        },
                    },
                },
            }
            const javaHostFile = new JavaHostFile(null, null, annotatedFile, 'Project1', 'test.java', 'nativePack')
            t.mockGetter(javaHostFile, 'relativePath', () => 'relative/path')

            const hostProject = {
                setHostFileContent: t.mockFn(async (pathRelativeToHostDir, bundles, hostFileContent) => {
                    expect(pathRelativeToHostDir).toBe('relative/path')
                    expect(bundles).toBe('bundles')
                    expect(hostFileContent).toBe('wrapping code')
                }),
            }

            await javaHostFile.generate(hostProject, ['all files'])
            expect(hostProject.setHostFileContent).toBeCalled()
        })

        test('error', async () => {
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
})