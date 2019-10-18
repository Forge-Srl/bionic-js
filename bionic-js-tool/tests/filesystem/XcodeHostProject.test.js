const t = require('../test-utils')
const copydir = require('copy-dir')
const xcode = require('xcode')

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

    const getProject = async (projectDirName, projectFile, tempName, codeUsingProject) => {
        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectDirName}/`)
            const tempProjectDir = tempDir.getSubDir(tempName)
            copydir.sync(projectDir.absolutePath, tempProjectDir.absolutePath, {utimes: true, mode: true, cover: true})
            const targetConfig = new ConfigurationHostTarget({
                xcodeProjectPath: tempProjectDir.getSubFile(projectFile).absolutePath,
                compileTargets: ['HostProject', 'HostProjectTarget2'],
            })
            await codeUsingProject(new XcodeHostProject(targetConfig, log))
        })

    }

    const getProjectWithoutHostFiles = async codeUsingProject => {
        return getProject('project-without-host-files', 'HostProject.xcodeproj', 'without-host-files', codeUsingProject)
    }

    const getProjectWithHostFiles = async codeUsingProject => {
        return getProject('project-with-host-files', 'HostProject.xcodeproj', 'with-host-files', codeUsingProject)
    }

    test('project', async () => {
        await getProjectWithoutHostFiles(async xcodeProject => {
            const project = xcodeProject.project
            expect(project.hash.project.rootObject).toBe('C5966C852349378B00EE670C')
        })
    })

    test('mainGroup', async () => {
        await getProjectWithoutHostFiles(async xcodeProject => {
            const mainGroup = xcodeProject.mainGroup

            expect(mainGroup.relativePathParts).toStrictEqual([])
            expect(mainGroup.relativePath).toBe('')
            expect(mainGroup.debugLocation).toBe('Project')

            const mainGroupChildren = mainGroup.children
            expect(mainGroupChildren.length).toBe(2)
            expect(mainGroupChildren[0].comment).toBe('HostProject')
            expect(mainGroupChildren[1].comment).toBe('Products')
        })
    })

    test('getGroupByKey', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C')

            expect(group.relativePathParts).toStrictEqual(['host'])
            expect(group.relativePath).toBe('host')
            expect(group.debugLocation).toBe('host')
        })
    })

    test('getGroupByKey, with fatherGroup', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C', {
                relativePathParts: ['father', 'path'],
                debugLocation: 'debugLocation',
            })

            expect(group.relativePathParts).toStrictEqual(['father', 'path', 'host'])
            expect(group.relativePath).toBe('father/path/host')
            expect(group.debugLocation).toBe('debugLocation/host')
        })
    })

    test('getGroupByKey, virtual group', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C')

            expect(group.relativePathParts).toStrictEqual([])
            expect(group.relativePath).toBe('')
            expect(group.debugLocation).toBe('Bjs')
        })
    })

    test('getGroupByKey, virtual group with fatherGroup', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C', {
                relativePathParts: ['father', 'path'],
                debugLocation: 'debugLocation',
            })

            expect(group.relativePathParts).toStrictEqual(['father', 'path'])
            expect(group.relativePath).toBe('father/path')
            expect(group.debugLocation).toBe('debugLocation/Bjs')
        })
    })

    test('getFileByKey', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const file = xcodeProject.getFileByKey('C5B80A18234A1A0E002FD95C')

            expect(file.relativePathParts).toStrictEqual(['MotorVehicle.swift'])
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
                relativePathParts: ['father', 'path'],
                debugLocation: 'debugLocation',
            })

            expect(file.relativePathParts).toStrictEqual(['father', 'path', 'MotorVehicle.swift'])
            expect(file.relativePath).toBe('father/path/MotorVehicle.swift')
            expect(file.debugLocation).toBe('debugLocation/MotorVehicle.swift')
            expect(file.fileType).toBe('sourcecode.swift')
        })
    })

    test('findGroupByDirPath', async () => {
        await getProjectWithoutHostFiles(async xcodeProject => {
            const libsGroup = xcodeProject.findGroupByDirPath('HostProject')

            expect(log.warningLog).toBe('')

            expect(libsGroup.relativePath).toBe('HostProject')
            expect(libsGroup.debugLocation).toBe('Project/HostProject')
            expect(libsGroup.children.length).toBe(11)
        })
    })

    test('findGroupByDirPath, with groups with wrong location attribute', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const libsGroup = xcodeProject.findGroupByDirPath('HostProject/Group2')

            expect(log.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')

            expect(libsGroup.relativePath).toBe('HostProject/Group2')
            expect(libsGroup.debugLocation).toBe('Project/HostProject/Group1/Group2')
            expect(libsGroup.children.length).toBe(1)
            expect(libsGroup.children[0].comment).toBe('Group3')
        })
    })

    test('findGroupByDirPath, no match', async () => {
        await getProjectWithoutHostFiles(async xcodeProject => {
            const libsGroup = xcodeProject.findGroupByDirPath('HostProject/notFound')

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

    test('emptyGroup', async () => {
        await getProjectWithHostFiles(async projectWithHostFiles => {
            await getProjectWithoutHostFiles(async projectWithoutHostFiles => {
                const hostGroup = projectWithHostFiles.findGroupByDirPath('HostProject/host')
                await projectWithHostFiles.emptyGroup(hostGroup)
                await projectWithHostFiles.save()

                const freshLoadedProjectWithHostFiles = xcode.project(projectWithHostFiles.projectFilePath).parseSync()
                const freshLoadedProjectWithoutHostFiles = xcode.project(projectWithoutHostFiles.projectFilePath).parseSync()

                expect(freshLoadedProjectWithHostFiles.hash).toStrictEqual(freshLoadedProjectWithoutHostFiles.hash)
            })
        })
    })

    test('emptyGroup, wrong host directory', async () => {
        await getProjectWithHostFiles(async xcodeProject => {
            const wrongGroup = xcodeProject.findGroupByDirPath('HostProject')
            await expect(xcodeProject.emptyGroup(wrongGroup)).rejects.toThrow('"HostProject/Bjs.framework", ' +
                '"HostProject/SceneDelegate.swift", "HostProject/Assets.xcassets", "HostProject/target1.plist", ' +
                '"HostProject/target2.plist", "HostProject/target3.plist" cannot be deleted: only source files and ' +
                'bundles can be placed inside the host directory')
        })
    })

    test('emptyGroup, package directory', async () => {
        await getProjectWithHostFiles(async projectWithHostFiles => {
            await getProjectWithoutHostFiles(async projectWithoutHostFiles => {

                const hostGroup = projectWithHostFiles.findGroupByDirPath('HostProject/host/package.bundle')
                await projectWithHostFiles.emptyGroup(hostGroup)
                await projectWithHostFiles.save()

                const freshLoadedProjectWithHostFiles = xcode.project(projectWithHostFiles.projectFilePath).parseSync()
                const freshLoadedProjectWithoutHostFiles = xcode.project(projectWithoutHostFiles.projectFilePath).parseSync()

                expect(freshLoadedProjectWithHostFiles.hash).toStrictEqual(freshLoadedProjectWithoutHostFiles.hash)
            })
        })
    })
})