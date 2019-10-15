const t = require('../test-utils')

describe('XcodeHostProject', () => {

    let XcodeHostProject, ConfigurationHostTarget, log

    beforeEach(() => {
        XcodeHostProject = t.requireModule('filesystem/XcodeHostProject').XcodeHostProject
        ConfigurationHostTarget = t.requireModule('filesystem/ConfigurationHostTarget').ConfigurationHostTarget
        const DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
        log = new DebugLog()
    })

    const getProjectWithoutHostFiles = () => {
        const projectWithoutHostFilesPath = t.getModuleAbsolutePath('testing-code/swift/project-without-host-files/HostProject.xcodeproj')
        const targetConfig = new ConfigurationHostTarget({
            xcodeProjectPath: projectWithoutHostFilesPath,
            compileTargets: ['HostProject', 'HostProjectTarget2'],
        })
        return new XcodeHostProject(targetConfig, log)
    }

    const getProjectWithHostFiles = () => {
        const projectWithtHostFilesPath = t.getModuleAbsolutePath('testing-code/swift/project-with-host-files/HostProject.xcodeproj')
        const targetConfig = new ConfigurationHostTarget({
            xcodeProjectPath: projectWithtHostFilesPath,
            compileTargets: ['HostProject', 'HostProjectTarget2'],
        })
        return new XcodeHostProject(targetConfig, log)
    }

    test('project', () => {
        const xcodeProject = getProjectWithoutHostFiles()
        const project = xcodeProject.project

        expect(project.hash.project.rootObject).toBe('C5966C852349378B00EE670C')
    })

    test('mainGroup', () => {
        const xcodeProject = getProjectWithoutHostFiles()
        const mainGroup = xcodeProject.mainGroup

        expect(mainGroup.relativePathParts).toStrictEqual([])
        expect(mainGroup.relativePath).toBe('')
        expect(mainGroup.debugLocation).toBe('Project')

        const mainGroupChildren = mainGroup.children
        expect(mainGroupChildren.length).toBe(2)
        expect(mainGroupChildren[0].comment).toBe('HostProject')
        expect(mainGroupChildren[1].comment).toBe('Products')
    })

    test('getGroupByKey', () => {
        const xcodeProject = getProjectWithHostFiles()
        const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C')

        expect(group.relativePathParts).toStrictEqual(['host'])
        expect(group.relativePath).toBe('host')
        expect(group.debugLocation).toBe('host')
    })

    test('getGroupByKey, with fatherGroup', () => {
        const xcodeProject = getProjectWithHostFiles()
        const group = xcodeProject.getGroupByKey('C5B80A14234A19DB002FD95C', {
            relativePathParts: ['father', 'path'],
            debugLocation: 'debugLocation',
        })

        expect(group.relativePathParts).toStrictEqual(['father', 'path', 'host'])
        expect(group.relativePath).toBe('father/path/host')
        expect(group.debugLocation).toBe('debugLocation/host')
    })

    test('getGroupByKey, virtual group', () => {
        const xcodeProject = getProjectWithHostFiles()
        const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C')

        expect(group.relativePathParts).toStrictEqual([])
        expect(group.relativePath).toBe('')
        expect(group.debugLocation).toBe('Bjs')
    })

    test('getGroupByKey, virtual group with fatherGroup', () => {
        const xcodeProject = getProjectWithHostFiles()
        const group = xcodeProject.getGroupByKey('C5B80A11234A19AF002FD95C', {
            relativePathParts: ['father', 'path'],
            debugLocation: 'debugLocation',
        })

        expect(group.relativePathParts).toStrictEqual(['father', 'path'])
        expect(group.relativePath).toBe('father/path')
        expect(group.debugLocation).toBe('debugLocation/Bjs')
    })

    test('getFileByKey', () => {
        const xcodeProject = getProjectWithHostFiles()
        const file = xcodeProject.getFileByKey('C5B80A18234A1A0E002FD95C')

        expect(file.relativePathParts).toStrictEqual(['MotorVehicle.swift'])
        expect(file.relativePath).toBe('MotorVehicle.swift')
        expect(file.debugLocation).toBe('MotorVehicle.swift')
        expect(file.fileType).toBe('sourcecode.swift')
    })

    test('getFileByKey, not source file', () => {
        const xcodeProject = getProjectWithHostFiles()
        const file = xcodeProject.getFileByKey('C5966C8D2349378B00EE670C')

        expect(log.warningLog).toBe('"HostProject.app": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')
        expect(file).toBe(null)
    })

    test('getFileByKey, with fatherGroup', () => {
        const xcodeProject = getProjectWithHostFiles()
        const file = xcodeProject.getFileByKey('C5B80A18234A1A0E002FD95C', {
            relativePathParts: ['father', 'path'],
            debugLocation: 'debugLocation',
        })

        expect(file.relativePathParts).toStrictEqual(['father', 'path', 'MotorVehicle.swift'])
        expect(file.relativePath).toBe('father/path/MotorVehicle.swift')
        expect(file.debugLocation).toBe('debugLocation/MotorVehicle.swift')
        expect(file.fileType).toBe('sourcecode.swift')
    })

    test('findGroupByDirPath', () => {
        const xcodeProject = getProjectWithoutHostFiles()
        const libsGroup = xcodeProject.findGroupByDirPath('HostProject')

        expect(log.warningLog).toBe('')

        expect(libsGroup.relativePath).toBe('HostProject')
        expect(libsGroup.debugLocation).toBe('Project/HostProject')
        expect(libsGroup.children.length).toBe(10)
    })

    test('findGroupByDirPath, with groups with wrong location attribute', () => {
        const xcodeProject = getProjectWithHostFiles()
        const libsGroup = xcodeProject.findGroupByDirPath('HostProject/host/libs')

        expect(log.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')

        expect(libsGroup.relativePath).toBe('HostProject/host/libs')
        expect(libsGroup.debugLocation).toBe('Project/HostProject/Bjs/host/libs')
        expect(libsGroup.children.length).toBe(2)
        expect(libsGroup.children[0].comment).toBe('Vehicle.swift')
        expect(libsGroup.children[1].comment).toBe('MotorVehicle.swift')
    })

    test('findGroupByDirPath, no match', () => {
        const xcodeProject = getProjectWithoutHostFiles()
        const libsGroup = xcodeProject.findGroupByDirPath('HostProject/notFound')

        expect(log.warningLog).toBe('')

        expect(libsGroup).toBe(null)
    })

    test('getFiles', () => {
        const xcodeProject = getProjectWithHostFiles()
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

    test('emptyGroup', () => {
        const xcodeProject = getProjectWithHostFiles()
        xcodeProject.deleteFiles = () => null
        const hostGroup = xcodeProject.findGroupByDirPath('HostProject/host')

        xcodeProject.emptyGroup(hostGroup)
    })

    test('emptyGroup integration', async () => {
        const xcodeProject = getProjectWithHostFiles()
        const hostGroup = xcodeProject.findGroupByDirPath('HostProject/host')
        await xcodeProject.emptyGroup(hostGroup)

        await xcodeProject.save()

    })
})