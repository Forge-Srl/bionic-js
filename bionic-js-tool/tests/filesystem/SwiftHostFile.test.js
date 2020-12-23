const t = require('../test-utils')

describe('SwiftHostFile', () => {

    const SwiftHostFile = t.requireModule('filesystem/SwiftHostFile').SwiftHostFile

    function buildTest(isNative, expectedFileName) {
        const annotatedFile = {
            guestFile: {
                name: 'Code',
                composeNewPath: (newRootDirPath, newName, newExtension) => {
                    expect(newRootDirPath).toBe('/host/dir')
                    expect(newName).toBe(expectedFileName)
                    expect(newExtension).toBe('.swift')
                    return 'code/file.swift'
                },
            },
            schema: {
                isNative: isNative,
            },
        }
        const hostProjectConfig = {hostDir: {path: '/host/dir'}}
        const projectName = 'projectName'
        const swiftHostFiles = SwiftHostFile.build(annotatedFile, hostProjectConfig, projectName)

        expect(swiftHostFiles.length).toBe(1)
        expect(swiftHostFiles[0]).toBeInstanceOf(SwiftHostFile)
        expect(swiftHostFiles[0].path).toBe('code/file.swift')
        expect(swiftHostFiles[0].rootDirPath).toBe('/host/dir')
        expect(swiftHostFiles[0].annotatedFile).toBe(annotatedFile)
        expect(swiftHostFiles[0].projectName).toBe(projectName)
    }

    test('build native file', () => {
        buildTest(true, 'CodeBjsWrapper')
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
                    forHosting: projectName => {
                        expect(projectName).toBe('Project1')
                        return {
                            swift: {
                                getSource: () => 'hosting code',
                            },
                        }
                    },
                },
            },
        }
        const swiftHostFile = new SwiftHostFile(null, null, annotatedFile, 'Project1')
        t.mockGetter(swiftHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, bundles, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(bundles).toBe('bundles')
                expect(hostFileContent).toBe('hosting code')
            }),
        }

        await swiftHostFile.generate(hostProject)
        expect(hostProject.setHostFileContent).toBeCalled()
    })

    test('generate, for wrapping guest file', async () => {
        const annotatedFile = {
            guestFile: {bundles: 'bundles'},
            schema: {
                isNative: true,
                generator: {
                    forHosting: projectName => {
                        expect(projectName).toBe('Project1')
                        return {swift: 'swiftHostClassGenerator'}
                    },
                    forWrapping: (hostGenerator, projectName) => {
                        expect(hostGenerator).toBe('swiftHostClassGenerator')
                        expect(projectName).toBe('Project1')
                        return {swift: {getSource: () => 'wrapping code'}}
                    },
                },
            },
        }
        const swiftHostFile = new SwiftHostFile(null, null, annotatedFile, 'Project1')
        t.mockGetter(swiftHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, bundles, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(bundles).toBe('bundles')
                expect(hostFileContent).toBe('wrapping code')
            }),
        }

        await swiftHostFile.generate(hostProject)
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
                        swift: {
                            getSource: () => {
                                throw new Error('generator error')
                            },
                        },
                    }),
                },
            },
        }
        const swiftHostFile = new SwiftHostFile(null, null, annotatedFile)
        await expect(swiftHostFile.generate()).rejects
            .toThrow('generating host code from guest file "guest/path"\ngenerator error')
    })
})