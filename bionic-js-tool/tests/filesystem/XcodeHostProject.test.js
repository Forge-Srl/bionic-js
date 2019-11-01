const t = require('../test-utils')
const copydir = require('copy-dir')
const xcode = require('xcode')
const {hostFilePaths, packageFilePaths} = require('../../testing-code/swift/files')

describe('XcodeHostProject', () => {

    let XcodeHostProject, ConfigurationHostTarget, File, Directory, log

    beforeEach(() => {
        XcodeHostProject = t.requireModule('filesystem/XcodeHostProject').XcodeHostProject
        ConfigurationHostTarget = t.requireModule('filesystem/ConfigurationHostTarget').ConfigurationHostTarget
        File = t.requireModule('filesystem/File').File
        Directory = t.requireModule('filesystem/Directory').Directory
        const DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
        log = new DebugLog()
    })

    const getProject = async (projectDirName, codeUsingProject) => {
        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectDirName}/`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})
            const targetConfig = new ConfigurationHostTarget({
                xcodeProjectPath: tempDir.getSubFile('HostProject.xcodeproj').absolutePath,
                hostDirName: 'HostProject/host',
                compileTargets: ['HostProject', 'HostProjectTarget2'],
            })
            await codeUsingProject(new XcodeHostProject(targetConfig, log))
        })
    }

    const getProjectWithoutHost = async codeUsingProject => {
        return getProject('project-without-host', codeUsingProject)
    }

    const getProjectWithHostFiles = async codeUsingProject => {
        return getProject('project-with-host-files', codeUsingProject)
    }

    const getProjectWithHostDirs = async codeUsingProject => {
        return getProject('project-with-host-dirs', codeUsingProject)
    }

    test('project', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const project = xcodeProject.project
            expect(project.hash.project.rootObject).toBe('C5966C852349378B00EE670C')
        })
    })

    test('mainGroup', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const mainGroup = xcodeProject.mainGroup

            expect(mainGroup.relativePath).toBe('')
            expect(mainGroup.debugLocation).toBe('Project')

            const mainGroupChildren = mainGroup.children
            expect(mainGroupChildren.length).toBe(2)
            expect(mainGroupChildren[0].comment).toBe('HostProject')
            expect(mainGroupChildren[1].comment).toBe('Products')
        })
    })

    test('compileTargetKeys', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const targetKeys = xcodeProject.compileTargetKeys
            expect(targetKeys).toStrictEqual(['C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C'])
        })
    })

    test('compileTargetKeys, wrong targets in config', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            xcodeProject.targetConfig.targetObj.compileTargets = ['HostProject', 'WrongTarget']

            expect(() => xcodeProject.compileTargetKeys).toThrow('compile target "WrongTarget" not found in the project')
        })
    })

    test('allTargetKeys', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const allTargetKeys = xcodeProject.allTargetKeys
            expect(allTargetKeys).toStrictEqual(['C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C', 'C5B809FF2349FF10002FD95C'])
        })
    })

    test('getGroupByKey', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C')

            expect(group.relativePath).toBe('host')
            expect(group.debugLocation).toBe('host')
        })
    })

    test('getGroupByKey, with fatherGroup', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C', {
                relativePath: 'father//path',
                debugLocation: 'debugLocation',
            })

            expect(group.relativePath).toBe('father/path/host')
            expect(group.debugLocation).toBe('debugLocation/host')
        })
    })

    test('getGroupByKey, virtual group', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C')

            expect(group.relativePath).toBe('')
            expect(group.debugLocation).toBe('Bjs')
        })
    })

    test('getGroupByKey, virtual group with fatherGroup', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C', {
                relativePath: 'father/path',
                debugLocation: 'debugLocation',
            })

            expect(group.relativePath).toBe('father/path')
            expect(group.debugLocation).toBe('debugLocation/Bjs')
        })
    })

    test('getFileByKey', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const file = xcodeProject.getFileByKey('C5B80A18234A1A0E002FD95C')

            expect(file.relativePath).toBe('MotorVehicle.swift')
            expect(file.debugLocation).toBe('MotorVehicle.swift')
            expect(file.fileType).toBe('sourcecode.swift')
        })
    })

    test('getFileByKey, not source file', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const file = xcodeProject.getFileByKey('C5966C8D2349378B00EE670C')

            expect(log.warningLog).toBe('"HostProject.app": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')
            expect(file).toBe(null)
        })
    })

    test('getFileByKey, with fatherGroup', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const file = xcodeProject.getFileByKey('C5B80A18234A1A0E002FD95C', {
                relativePath: 'father/path',
                debugLocation: 'debugLocation',
            })

            expect(file.relativePath).toBe('father/path/MotorVehicle.swift')
            expect(file.debugLocation).toBe('debugLocation/MotorVehicle.swift')
            expect(file.fileType).toBe('sourcecode.swift')
        })
    })

    test('getGroupByDirPath', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const libsGroup = xcodeProject.getGroupByDirPath('HostProject')

            expect(log.warningLog).toBe('')

            expect(libsGroup.relativePath).toBe('HostProject')
            expect(libsGroup.debugLocation).toBe('Project/HostProject')
            expect(libsGroup.children.length).toBe(11)
        })
    })

    test('getGroupByDirPath, with groups with wrong location attribute', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const libsGroup = xcodeProject.getGroupByDirPath('HostProject/Group2')

            expect(log.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')

            expect(libsGroup.relativePath).toBe('HostProject/Group2')
            expect(libsGroup.debugLocation).toBe('Project/HostProject/Group1/Group2')
            expect(libsGroup.children.length).toBe(1)
            expect(libsGroup.children[0].comment).toBe('Group3')
        })
    })

    test('getGroupByDirPath, no match', async () => {
        await getProjectWithoutHost(async xcodeProject => {
            const libsGroup = xcodeProject.getGroupByDirPath('HostProject/notFound')

            expect(libsGroup).toBe(null)
        })
    })

    test('getFiles', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = {
                'children': [{'value': 'C5B80A11234A19AF002FD95C', 'comment': 'Bjs'}],
                'path': 'HostProject',
                'sourceTree': '"<group>"',
                'relativePathParts': ['HostProject'],
                'relativePath': 'HostProject',
                'debugLocation': 'Project/HostProject',
            }
            const files = xcodeProject.getFiles(group)
            expect(files.length).toBe(7)
            expect(files.map(file => file.path)).toStrictEqual(['Bjs.framework', 'package.bundle', 'FerrariCalifornia.swift',
                'Vehicle.swift', 'MotorVehicle.swift', 'EngineWrapper.swift', 'TeslaRoadster.swift'])
        })
    })

    test('normalizeRelativePath', () => {
        const project = new XcodeHostProject()
        expect(project.normalizeRelativePath('')).toBe('')
        expect(project.normalizeRelativePath('/')).toBe('')
        expect(project.normalizeRelativePath('/dir1/dir2/')).toBe('dir1/dir2')
        expect(project.normalizeRelativePath('//dir1///dir2/')).toBe('dir1/dir2')
        expect(project.normalizeRelativePath('dir1/dir2')).toBe('dir1/dir2')
        expect(project.normalizeRelativePath('dir1')).toBe('dir1')
    })

    const checkHostFiles = async (hostDirectory, existence) => {
        for (const hostFilePath of hostFilePaths) {
            expect(await hostDirectory.getSubFile(hostFilePath).exists()).toBe(existence)
        }
        for (const packageFilePath of packageFilePaths) {
            expect(await hostDirectory.getSubDir('package.bundle').getSubFile(packageFilePath).exists()).toBe(existence)
        }
    }

    test('cleanHostDir', async () => {
        await getProjectWithoutHost(async projectWithoutHost => {
            await getProjectWithHostFiles(async projectWithHostFiles => {

                const hostDirectory = new Directory(projectWithHostFiles.targetConfig.hostDirPath)
                await checkHostFiles(hostDirectory, true)
                expect(await hostDirectory.exists()).toBe(true)

                await projectWithHostFiles.cleanHostDir()

                await checkHostFiles(hostDirectory, false)
                await projectWithHostFiles.save()
                expect(await hostDirectory.exists()).toBe(true)

                const freshLoadedProjectWithHostFiles = xcode.project(projectWithHostFiles.targetConfig.xcodeProjectFilePath).parseSync()
                expect(freshLoadedProjectWithHostFiles.hash).toStrictEqual(projectWithoutHost.project.hash)
            })
        })
    })

    test('cleanHostDir, host directory not existent', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            t.mockGetter(xcodeProject.targetConfig, 'hostDirName', () => 'notExistingDir')
            await expect(xcodeProject.cleanHostDir())
        })
    })

    test('cleanHostDir, wrong host directory', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            t.mockGetter(xcodeProject.targetConfig, 'hostDirName', () => 'HostProject')
            await expect(xcodeProject.cleanHostDir()).rejects.toThrow('"HostProject/Bjs.framework", ' +
                '"HostProject/SceneDelegate.swift", "HostProject/Assets.xcassets", "HostProject/target1.plist", ' +
                '"HostProject/target2.plist", "HostProject/target3.plist" cannot be deleted: only source files and ' +
                'bundles can be placed inside the host directory')
        })
    })


    test('ensureGroupExists', async () => {
        await getProjectWithHostDirs(async projectWithHostDirs => {
            await getProjectWithoutHost(async projectWithoutHost => {
                expect(projectWithoutHost.project.generateUuid().length).toBe(24)
                projectWithoutHost.project.generateUuid = t.mockFn()
                projectWithoutHost.project.generateUuid.mockReturnValueOnce('C5B80A16234A1A0E002FD95C') // PBXGroup: libs
                projectWithoutHost.project.generateUuid.mockReturnValueOnce('C5B80A22234A1A0E002FD95C') // PBXGroup: native

                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/libs'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/libs'))
                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/native'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/native'))
                await projectWithoutHost.save()

                let freshLoadedProjectWithoutHost = xcode.project(projectWithoutHost.targetConfig.xcodeProjectFilePath).parseSync()
                expect(freshLoadedProjectWithoutHost.hash).toStrictEqual(projectWithHostDirs.project.hash)

                expect(await projectWithoutHost.ensureGroupExists('HostProject/host'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host'))
                expect(await projectWithoutHost.ensureGroupExists('HostProject'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject'))
                await projectWithoutHost.save()

                freshLoadedProjectWithoutHost = xcode.project(projectWithoutHost.targetConfig.xcodeProjectFilePath).parseSync()
                expect(freshLoadedProjectWithoutHost.hash).toStrictEqual(projectWithHostDirs.project.hash)
            })
        })
    })

    const orderSubArray = (objects, subArrayName) => {
        for (const objectKey in objects) {
            const object = objects[objectKey]
            if (object[subArrayName]) {
                object[subArrayName] = object[subArrayName].sort((child1, child2) => child1.comment.localeCompare(child2.comment))
            }
        }
        return objects
    }

    test('setHostFileContent and setPackageFileContent', async () => {
        await getProjectWithHostFiles(async projWithHostFiles => {
            await getProjectWithoutHost(async projWithoutHost => {

                const uuidFn = projWithoutHost.project.generateUuid = t.mockFn()
                uuidFn.mockReturnValueOnce('C5B80A15234A1A0E002FD95C') // PBXFile: FerrariCalifornia.swift
                uuidFn.mockReturnValueOnce('C5B80A24234A1A0E002FD95C') // PBXBuildFile (target1): FerrariCalifornia.swift
                uuidFn.mockReturnValueOnce('C5B80A25234A1A0E002FD95C') // PBXBuildFile (target2): FerrariCalifornia.swift

                uuidFn.mockReturnValueOnce('C5B80A19234A1A0E002FD95C') // PBXFile: TeslaRoadster.swift
                uuidFn.mockReturnValueOnce('C5B80A2A234A1A0E002FD95C') // PBXBuildFile (target1): TeslaRoadster.swift
                uuidFn.mockReturnValueOnce('C5B80A2B234A1A0E002FD95C') // PBXBuildFile (target2): TeslaRoadster.swift

                uuidFn.mockReturnValueOnce('C5B80A16234A1A0E002FD95C') // PBXGroup: libs

                uuidFn.mockReturnValueOnce('C5B80A18234A1A0E002FD95C') // PBXFile: libs/MotorVehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A28234A1A0E002FD95C') // PBXBuildFile (target1): MotorVehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A29234A1A0E002FD95C') // PBXBuildFile (target2): MotorVehicle.swift

                uuidFn.mockReturnValueOnce('C5B80A17234A1A0E002FD95C') // PBXFile: libs/Vehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A26234A1A0E002FD95C') // PBXBuildFile (target1): Vehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A27234A1A0E002FD95C') // PBXBuildFile (target2): Vehicle.swift

                uuidFn.mockReturnValueOnce('C5B80A22234A1A0E002FD95C') // PBXGroup: native

                uuidFn.mockReturnValueOnce('C5B80A23234A1A0E002FD95C') // PBXFile: native/EngineWrapper.swift
                uuidFn.mockReturnValueOnce('C5B80A36234A1A0E002FD95C') // PBXBuildFile (target1): EngineWrapper.swift
                uuidFn.mockReturnValueOnce('C5B80A37234A1A0E002FD95C') // PBXBuildFile (target2): EngineWrapper.swift

                uuidFn.mockReturnValueOnce('C5B80A38234A1A8B002FD95C') // PBXFile: package.bundle
                uuidFn.mockReturnValueOnce('C5B80A39234A1A8B002FD95C') // PBXBuildFile (target1): package.bundle
                uuidFn.mockReturnValueOnce('C5B80A3A234A1A8B002FD95C') // PBXBuildFile (target2): package.bundle

                const hostDirPath = projWithHostFiles.targetConfig.hostDirPath
                for (const hostFilePath of hostFilePaths) {
                    const hostFile = new Directory(hostDirPath).getSubFile(hostFilePath)
                    await projWithoutHost.setHostFileContent(hostFilePath, await hostFile.getContent())
                }
                for (const packageFilePath of packageFilePaths) {
                    const packageFile = new Directory(hostDirPath).getSubDir('package.bundle').getSubFile(packageFilePath)
                    await projWithoutHost.setPackageFileContent(packageFilePath, await packageFile.getContent())
                }
                await projWithoutHost.save()

                const freshProjWithoutHost = xcode.project(projWithoutHost.targetConfig.xcodeProjectFilePath).parseSync()

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXGroup, 'children')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXGroup, 'children')

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXResourcesBuildPhase, 'files')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXResourcesBuildPhase, 'files')

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXSourcesBuildPhase, 'files')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXSourcesBuildPhase, 'files')

                expect(freshProjWithoutHost.hash).toStrictEqual(projWithHostFiles.project.hash)
            })
        })
    })
})