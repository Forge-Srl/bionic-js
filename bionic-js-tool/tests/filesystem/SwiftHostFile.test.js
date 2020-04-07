const t = require('../test-utils')

describe('SwiftHostFile', () => {

    const SwiftHostFile = t.requireModule('filesystem/SwiftHostFile').SwiftHostFile

    test('build native file', () => {
        const exportedFile = {
            guestFile: {
                name: 'Code',
                isNative: true,
                composeNewPath: (newRootDirPath, newName, newExtension) => {
                    expect(newRootDirPath).toBe('/host/dir')
                    expect(newName).toBe('CodeWrapper')
                    expect(newExtension).toBe('.swift')
                    return 'host/dir/guest/CodeWrapper.swift'
                },
            },
        }
        const targetConfig = {hostDirPath: '/host/dir'}
        const swiftHostFile = SwiftHostFile.build(exportedFile, targetConfig)

        expect(swiftHostFile).toBeInstanceOf(SwiftHostFile)
        expect(swiftHostFile.path).toBe('host/dir/guest/CodeWrapper.swift')
        expect(swiftHostFile.rootDirPath).toBe('/host/dir')
        expect(swiftHostFile.exportedFile).toBe(exportedFile)
    })

    test('build hosted file', () => {
        const exportedFile = {
            guestFile: {
                name: 'Code',
                isNative: false,
                composeNewPath: (newRootDirPath, newName, newExtension) => {
                    expect(newRootDirPath).toBe('/host/dir')
                    expect(newName).toBe('Code')
                    expect(newExtension).toBe('.swift')
                    return 'host/dir/guest/Code.swift'
                },
            },
        }
        const targetConfig = {hostDirPath: '/host/dir'}
        const swiftHostFile = SwiftHostFile.build(exportedFile, targetConfig)

        expect(swiftHostFile).toBeInstanceOf(SwiftHostFile)
        expect(swiftHostFile.path).toBe('host/dir/guest/Code.swift')
        expect(swiftHostFile.rootDirPath).toBe('/host/dir')
        expect(swiftHostFile.exportedFile).toBe(exportedFile)
    })

    test('generate, for hosting guest file', async () => {
        const exportedFile = {
            guestFile: {
                isNative: false,
            },
            schema: {
                generator: {
                    forHosting: () => ({
                        swift: {
                            getSource: () => 'hosting code',
                        },
                    }),
                },
            },
        }
        const swiftHostFile = new SwiftHostFile(null, null, exportedFile)
        t.mockGetter(swiftHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(hostFileContent).toBe('hosting code')
            }),
        }

        await swiftHostFile.generate(hostProject)
        expect(hostProject.setHostFileContent).toBeCalled()
    })

    test('generate, for wrapping guest file', async () => {

        const exportedFile = {
            guestFile: {
                isNative: true,
            },
            schema: {
                generator: {
                    forHosting: () => ({
                        swift: 'swiftHostClassGenerator',
                    }),
                    forWrapping: (hostGenerator) => {
                        expect(hostGenerator).toBe('swiftHostClassGenerator')
                        return {
                            swift: {
                                getSource: () => 'hosting code',
                            },
                        }
                    },
                },
            },
        }
        const swiftHostFile = new SwiftHostFile(null, null, exportedFile)
        t.mockGetter(swiftHostFile, 'relativePath', () => 'relative/path')

        const hostProject = {
            setHostFileContent: t.mockFn(async (pathRelativeToHostDir, hostFileContent) => {
                expect(pathRelativeToHostDir).toBe('relative/path')
                expect(hostFileContent).toBe('hosting code')
            }),
        }

        await swiftHostFile.generate(hostProject)
        expect(hostProject.setHostFileContent).toBeCalled()
    })

    test('generate, error', async () => {
        const exportedFile = {
            guestFile: {
                isNative: false,
                relativePath: 'guest/path'
            },
            schema: {
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
        const swiftHostFile = new SwiftHostFile(null, null, exportedFile)
        await expect(swiftHostFile.generate()).rejects
            .toThrow('generating host code from guest file "guest/path"\ngenerator error')
    })
})