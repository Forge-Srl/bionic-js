const t = require('../test-utils')
const copydir = require('copy-dir')
const xcode = require('xcode')
const {hostFiles, bundleFiles} = require('../../testing-code/swift/files')
const fs = require('fs')

describe('XcodeHostProject', () => {

    let XcodeHostProject, BjsConfiguration, HostProjectFile, BundleProjectFile, Directory, log

    beforeEach(() => {
        XcodeHostProject = t.requireModule('filesystem/XcodeHostProject').XcodeHostProject
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
        HostProjectFile = t.requireModule('filesystem/HostProjectFile').HostProjectFile
        BundleProjectFile = t.requireModule('filesystem/BundleProjectFile').BundleProjectFile
        Directory = t.requireModule('filesystem/Directory').Directory
        const Log = t.requireModule('filesystem/Log').Log
        log = new Log(true)
    })

    async function getProject(projectDirName, codeUsingProject) {
        const testConfig = BjsConfiguration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
        const testConfigJson = JSON.stringify(testConfig.configObj)

        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectDirName}/`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})
            const config = new BjsConfiguration(JSON.parse(testConfigJson)).hostProjects[0]
            config.configObj.projectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            await codeUsingProject(new XcodeHostProject(config, log))
        })
    }

    async function getProjectWithoutHostFiles(codeUsingProject) {
        return getProject('project-without-host', codeUsingProject)
    }

    async function getProjectWithHostFiles(codeUsingProject) {
        return getProject('project-with-host-files', codeUsingProject)
    }

    async function getProjectWithHostDirs(codeUsingProject) {
        return getProject('project-with-host-dirs', codeUsingProject)
    }

    test.each([
        ['standard/path', 'standard/path'],
        ['standard-path', 'standard-path'],
        ['quoted/"/"/path', '"quoted/\\"/\\"/path"'],
        ['', ''],
        [null, null],
        [undefined, undefined],
    ])('encodePath %s', (path, expected) => {
        expect(XcodeHostProject.encodePath(path)).toBe(expected)
    })

    test.each([
        ['standard/path', 'standard/path'],
        ['', ''],
        ['""', ''],
        [null, null],
        [undefined, undefined],
        ['"quoted/path"', 'quoted/path'],
        ['"quoted/\n/path"', 'quoted/\n/path'],
        ['"quoted/\\"/\\"/path"', 'quoted/"/"/path']
    ])('decodePath %s', (path, expected) => {
        expect(XcodeHostProject.decodePath(path)).toBe(expected)
    })

    test.each([
        ['', ''],
        ['/', ''],
        ['/dir1/dir2/', 'dir1/dir2'],
        ['//dir1///dir2/', 'dir1/dir2'],
        ['dir1/dir2', 'dir1/dir2'],
        ['dir1', 'dir1'],
    ])('normalizeRelativePath %s', (path, expected) => {
        expect(XcodeHostProject.normalizeRelativePath(path)).toBe(expected)
    })

    test('project', async () => {
        await getProjectWithoutHostFiles(async xcodeProject => {
            const project = xcodeProject.project
            expect(project.hash.project.rootObject).toBe('C5966C852349378B00EE670C')
        })
    })

    test('mainGroup', async () => {
        await getProjectWithoutHostFiles(async project => {
            const mainGroup = project.mainGroup

            expect(mainGroup.relativePath).toBe('')
            expect(mainGroup.debugLocation).toBe('Project')

            const mainGroupChildren = mainGroup.children
            expect(mainGroupChildren.length).toBe(2)
            expect(mainGroupChildren[0].comment).toBe('HostProject')
            expect(mainGroupChildren[1].comment).toBe('Products')
        })
    })

    test('getCompileTargetKeys', async () => {
        await getProjectWithoutHostFiles(async project => {
            const targetKeys = project.getCompileTargetKeys(['BicycleTarget', 'MotorVehiclesTarget', 'VehiclesTarget', 'Unused (target)'])
            expect(targetKeys).toStrictEqual(['C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C', 'C5B809FF2349FF10002FD95C', 'C56F02B42541E25D00B221DA'])
        })
    })

    test('getCompileTargetKeys, wrong targets in config', async () => {
        await getProjectWithoutHostFiles(async project => {
            expect(() => project.getCompileTargetKeys(['BicycleTarget', 'WrongTarget']))
                .toThrow('compile target "WrongTarget" not found in the Xcode project')
        })
    })

    test('getCompileTargets', async () => {
        await getProjectWithoutHostFiles(async project => {
            const vehiclesTargets = project.getCompileTargets(['Vehicles'])
            expect(vehiclesTargets).toEqual(['VehiclesTarget', 'BicycleTarget'])

            const motorVehiclesTargets = project.getCompileTargets(['MotorVehicles'])
            expect(motorVehiclesTargets).toEqual(['MotorVehiclesTarget'])

            const noTargets = project.getCompileTargets(['WrongBundle'])
            expect(noTargets).toEqual([])
        })
    })

    test('allTargetKeys', async () => {
        await getProjectWithoutHostFiles(async project => {
            const allTargetKeys = project.allTargetKeys
            expect(allTargetKeys).toStrictEqual(['C56F02B42541E25D00B221DA', 'C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C', 'C5B809FF2349FF10002FD95C'])
        })
    })

    test('targetKeysFilesMap', async () => {
        await getProjectWithHostFiles(async project => {
            const map = project.targetKeysFilesMap
            expect(map.get('C56F04962546A8FE00B221DA')).toEqual(['MotorVehiclesTarget']) // MotorVehicles.bjs,bundle
            expect(map.get('C56F049C2546A90700B221DA')).toEqual(['BicycleTarget', 'VehiclesTarget']) // Vehicles.bjs.bundle
            expect(map.get('C56F03412541ECA200B221DA')).toEqual(['BicycleTarget', 'VehiclesTarget']) // BjsEnvironmentVehicles.swift
            expect(map.get('C5B80A15234A1A0E002FD95C')).toEqual(['MotorVehiclesTarget']) // BjsEnvironmentMotorVehicles.swift
            expect(map.get('C5B80A22234A1A0E002FD95C')).toEqual(['BicycleTarget', 'MotorVehiclesTarget', 'VehiclesTarget']) // Vehicle.swift
            expect(map.get('not found')).toBe(undefined)
        })
    })

    test('targetKeysBundleMap', async () => {
        await getProjectWithHostFiles(async project => {
            const map = project.targetKeysBundleMap
            expect(map).toEqual(new Map([
                ['MotorVehiclesTarget', 'MotorVehicles'],
                ['VehiclesTarget', 'Vehicles'],
                ['BicycleTarget', 'Vehicles'],
            ]))
        })
    })

    test('getGroupByKey', async () => {
        await getProjectWithHostFiles(async project => {
            const group = project.getGroupByKey('C5B80A14234A19DB002FD95C')

            expect(group.relativePath).toBe('host')
            expect(group.debugLocation).toBe('host')
        })
    })

    test('getGroupByKey, with fatherGroup', async () => {
        await getProjectWithHostFiles(async project => {
            const group = project.getGroupByKey('C5B80A14234A19DB002FD95C', {
                relativePath: 'father//path',
                debugLocation: 'debugLocation',
            })

            expect(group.relativePath).toBe('father/path/host')
            expect(group.debugLocation).toBe('debugLocation/host')
        })
    })

    test('getGroupByKey, virtual group', async () => {
        await getProjectWithHostFiles(async project => {
            const group = project.getGroupByKey('C5B80A11234A19AF002FD95C')

            expect(group.relativePath).toBe('')
            expect(group.debugLocation).toBe('Bjs')
        })
    })

    test('getGroupByKey, virtual group with fatherGroup', async () => {
        await getProjectWithHostFiles(async project => {
            const group = project.getGroupByKey('C5B80A11234A19AF002FD95C', {
                relativePath: 'father/path',
                debugLocation: 'debugLocation',
            })

            expect(group.relativePath).toBe('father/path')
            expect(group.debugLocation).toBe('debugLocation/Bjs')
        })
    })

    test('getFileByKey', async () => {
        await getProjectWithHostFiles(async project => {
            const file = project.getFileByKey('C5B80A17234A1A0E002FD95C')

            expect(log.warningLog).toBe('')


            expect(file.relativePath).toBe('MotorVehicle.swift')
            expect(file.debugLocation).toBe('MotorVehicle.swift')
            expect(file.fileType).toBe('sourcecode.swift')
        })
    })

    test('getFileByKey, not source file', async () => {
        await getProjectWithHostFiles(async project => {
            const file = project.getFileByKey('C5966C8D2349378B00EE670C')

            expect(log.warningLog).toBe('"BicycleTarget.app": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')
            expect(file).toBe(null)
        })
    })

    test('getFileByKey, with fatherGroup', async () => {
        await getProjectWithHostFiles(async project => {
            const file = project.getFileByKey('C5B80A17234A1A0E002FD95C', {
                relativePath: 'father/path',
                debugLocation: 'debugLocation',
            })

            expect(file.relativePath).toBe('father/path/MotorVehicle.swift')
            expect(file.debugLocation).toBe('debugLocation/MotorVehicle.swift')
            expect(file.fileType).toBe('sourcecode.swift')
        })
    })

    test('getGroupByDirPath, root dir', async () => {
        await getProjectWithoutHostFiles(async project => {
            const libsGroup = project.getGroupByDirPath('')
            expect(libsGroup.key).toBe('C5966C842349378B00EE670C')
        })
    })

    test('getGroupByDirPath', async () => {
        await getProjectWithoutHostFiles(async project => {
            const libsGroup = project.getGroupByDirPath('HostProject')
            const sameLibsGroup = project.getGroupByDirPath('/HostProject')

            expect(log.warningLog).toBe('')

            expect(sameLibsGroup).toEqual(libsGroup)
            expect(libsGroup.relativePath).toBe('HostProject')
            expect(libsGroup.debugLocation).toBe('Project/HostProject')
            expect(libsGroup.children.length).toBe(13)
        })
    })

    test('getGroupByDirPath, path of a file', async () => {
        await getProjectWithoutHostFiles(async project => {
            const nullGroup = project.getGroupByDirPath('HostProject/host/BjsEnvironment.swift')

            expect(nullGroup).toBe(null)
        })
    })

    test('getGroupByDirPath, with groups with wrong location attribute', async () => {
        await getProjectWithHostFiles(async project => {
            const libsGroup = project.getGroupByDirPath('HostProject/Group2')

            expect(log.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')

            expect(libsGroup.relativePath).toBe('HostProject/Group2')
            expect(libsGroup.debugLocation).toBe('Project/HostProject/Group1/Group2')
            expect(libsGroup.children.length).toBe(1)
            expect(libsGroup.children[0].comment).toBe('Group3')
        })
    })

    test('getGroupByDirPath, no match', async () => {
        await getProjectWithoutHostFiles(async project => {
            const libsGroup = project.getGroupByDirPath('HostProject/notFound')

            expect(libsGroup).toBe(null)
        })
    })

    const hostProjectGroup = {
        'children': [{'value': 'C5B80A11234A19AF002FD95C', 'comment': 'Bjs'}],
        'path': 'HostProject',
        'sourceTree': '"<group>"',
        'relativePathParts': ['HostProject'],
        'relativePath': 'HostProject',
        'debugLocation': 'Project/HostProject',
    }

    test('getFiles', async () => {
        await getProjectWithHostFiles(async project => {

            XcodeHostProject.decodePath = t.mockFn(path => path)
            const files = project.getFiles(hostProjectGroup)
            expect(files.map(file => file.path)).toStrictEqual([
                'Bjs.framework', 'Bicycle.swift', 'FerrariCalifornia.swift', 'TeslaRoadster.swift',
                'FuelType.swift', 'MotorVehicle.swift', 'Vehicle.swift', 'BaseEngineBjsWrapper.swift',
                'EngineBjsWrapper.swift', 'BjsBeautifulVehicles.swift', 'MotorVehicles.bjs.bundle',
                'BjsBeautifulVehicles.swift', 'Vehicles.bjs.bundle'])

            expect(files.map(file => file.relativePath)).toStrictEqual([
                'HostProject/Bjs.framework', 'HostProject/host/Bicycle.swift', 'HostProject/host/FerrariCalifornia.swift',
                'HostProject/host/TeslaRoadster.swift', 'HostProject/host/libs/FuelType.swift',
                'HostProject/host/libs/MotorVehicle.swift', 'HostProject/host/libs/Vehicle.swift',
                'HostProject/host/native/BaseEngineBjsWrapper.swift', 'HostProject/host/native/EngineBjsWrapper.swift',
                'HostProject/host/BjsMotorVehicles/BjsBeautifulVehicles.swift',
                'HostProject/host/BjsMotorVehicles/MotorVehicles.bjs.bundle',
                'HostProject/host/BjsVehicles/BjsBeautifulVehicles.swift',
                'HostProject/host/BjsVehicles/Vehicles.bjs.bundle'])

            expect(files.map(file => file.debugLocation)).toStrictEqual([
                'Project/HostProject/Bjs/Bjs.framework', 'Project/HostProject/Bjs/host/Bicycle.swift',
                'Project/HostProject/Bjs/host/FerrariCalifornia.swift', 'Project/HostProject/Bjs/host/TeslaRoadster.swift',
                'Project/HostProject/Bjs/host/libs/FuelType.swift', 'Project/HostProject/Bjs/host/libs/MotorVehicle.swift',
                'Project/HostProject/Bjs/host/libs/Vehicle.swift',
                'Project/HostProject/Bjs/host/native/BaseEngineBjsWrapper.swift',
                'Project/HostProject/Bjs/host/native/EngineBjsWrapper.swift',
                'Project/HostProject/Bjs/host/BjsMotorVehicles/BjsBeautifulVehicles.swift',
                'Project/HostProject/Bjs/host/BjsMotorVehicles/MotorVehicles.bjs.bundle',
                'Project/HostProject/Bjs/host/BjsVehicles/BjsBeautifulVehicles.swift',
                'Project/HostProject/Bjs/host/BjsVehicles/Vehicles.bjs.bundle',
            ])

            expect(XcodeHostProject.decodePath).toHaveBeenCalledTimes(19) // 13 files + 6 dirs
        })
    })

    test('getFile', async () => {
        await getProjectWithHostFiles(async project => {
            const sourceFile = project.getFile(hostProjectGroup, 'HostProject/host/native/EngineBjsWrapper.swift')
            expect(sourceFile).toMatchObject({
                fatherGroup: {
                    debugLocation: 'Project/HostProject/Bjs/host/native',
                    key: 'C5B80A37234A1A0E002FD95C',
                    path: 'native',
                    relativePath: 'HostProject/host/native',
                },
                file: {
                    debugLocation: 'Project/HostProject/Bjs/host/native/EngineBjsWrapper.swift',
                    key: 'C5B80A38234A1A8B002FD95C',
                    path: 'EngineBjsWrapper.swift',
                    relativePath: 'HostProject/host/native/EngineBjsWrapper.swift',
                },
            })

            const bundleFile = project.getFile(hostProjectGroup, '/HostProject/host/BjsMotorVehicles/MotorVehicles.bjs.bundle')
            expect(bundleFile).toMatchObject({
                fatherGroup: {
                    debugLocation: 'Project/HostProject/Bjs/host/BjsMotorVehicles',
                    key: 'C502FCE9255BFD1D007DCF40',
                    path: 'BjsMotorVehicles',
                    relativePath: 'HostProject/host/BjsMotorVehicles',
                },
                file: {
                    debugLocation: 'Project/HostProject/Bjs/host/BjsMotorVehicles/MotorVehicles.bjs.bundle',
                    key: 'C56F04962546A8FE00B221DA',
                    path: 'MotorVehicles.bjs.bundle',
                    relativePath: 'HostProject/host/BjsMotorVehicles/MotorVehicles.bjs.bundle',
                },
            })
        })
    })

    test('getProjectFiles', async () => {
        await getProjectWithHostFiles(async project => {
            const checkForIncompatibleHostFiles = jest.spyOn(XcodeHostProject, 'checkForIncompatibleHostFiles')

            const files = (await project.getProjectFiles()).sort((file1, file2) => file1.id < file2.id ? -1 : file1.id > file2.id ? 1 : 0)
            expect(files.map(file => file.id)).toStrictEqual([
                'Bicycle.swift', 'BjsMotorVehicles/BjsBeautifulVehicles.swift', 'BjsVehicles/BjsBeautifulVehicles.swift',
                'FerrariCalifornia.swift', 'MotorVehicles', 'TeslaRoadster.swift', 'Vehicles', 'libs/FuelType.swift',
                'libs/MotorVehicle.swift', 'libs/Vehicle.swift', 'native/BaseEngineBjsWrapper.swift',
                'native/EngineBjsWrapper.swift',
            ])
            expect(files.map(file => file.constructor.name)).toStrictEqual([
                'HostProjectFile', 'HostProjectFile', 'HostProjectFile', 'HostProjectFile',
                'BundleProjectFile', 'HostProjectFile', 'BundleProjectFile', 'HostProjectFile', 'HostProjectFile',
                'HostProjectFile', 'HostProjectFile', 'HostProjectFile',
            ])
            expect(files.map(file => file.bundles)).toStrictEqual([
                ['Vehicles'], ['MotorVehicles'], ['Vehicles'],
                ['MotorVehicles'], ['MotorVehicles'], ['MotorVehicles'], ['Vehicles'], ['MotorVehicles'],
                ['MotorVehicles'], ['Vehicles', 'MotorVehicles'], ['MotorVehicles'],
                ['MotorVehicles'],
            ])
            expect(files.map(file => file.content.length)).toStrictEqual([365, 336, 223, 353, 11973, 810, 3776, 1379,
                1483, 905, 1711, 1169])
            expect(checkForIncompatibleHostFiles).toHaveBeenCalledTimes(1)
        })
    })

    const wrongHostFilesTypeError = '"HostProject/Bjs.framework", ' +
        '"HostProject/SceneDelegate.swift", "HostProject/Assets.xcassets", "HostProject/BicycleTarget.plist", ' +
        '"HostProject/MotorVehiclesTarget.plist", "HostProject/UnusedTarget.plist", "HostProject/VehiclesTarget.plist" ' +
        'not supported: only .swift source files and bundles with ".bjs.bundle" suffix are allowed inside the host directory'

    test('getHostFiles, wrong host files type', async () => {
        await getProjectWithHostFiles(async project => {
            t.mockGetter(project.config, 'hostDirName', () => 'HostProject')
            await expect(project.getProjectFiles()).rejects.toThrow(wrongHostFilesTypeError)
        })
    })

    test('checkForIncompatibleHostFiles', async () => {
        XcodeHostProject.checkForIncompatibleHostFiles([
            {fileType: 'sourcecode.swift', relativePath: 'path/to/file.swift'},
            {fileType: '"wrapper.plug-in"', relativePath: 'path/to/file.bjs.bundle'},
        ])
        expect(() => XcodeHostProject.checkForIncompatibleHostFiles([
            {fileType: 'other.format', relativePath: 'path/to/file.format'},
            {fileType: '"wrapper.plug-in"', relativePath: 'path/to/file.bundle'},
        ])).toThrow('"path/to/file.format", "path/to/file.bundle" not supported: only .swift source files and bundles ' +
            'with ".bjs.bundle" suffix are allowed inside the host directory')
    })

    test('removeHostFileFromProject', async () => {
        await getProjectWithHostFiles(async project => {

            const fileName = 'BjsMotorVehicles/BjsBeautifulVehicles.swift'
            const hostDirName = project.config.hostDirName
            const fileRelativePath = `${hostDirName}/${fileName}`
            const hostFile = project.config.xcodeProjectDir.getSubDir(hostDirName).getSubFile(fileName)

            let hostDirGroup = project.getGroupByDirPath(hostDirName)
            expect(project.getFile(hostDirGroup, fileRelativePath)).not.toBe(null)
            expect(await hostFile.exists()).toBe(true)

            await project.removeHostFileFromProject(fileName)

            hostDirGroup = project.getGroupByDirPath(hostDirName)
            expect(project.getFile(hostDirGroup, fileRelativePath)).toBe(null)
            expect(await hostFile.exists()).toBe(false)
        })
    })

    test('removeHostFileFromProject, two files with same name and one is removed', async () => {
        await getProjectWithoutHostFiles(async project => {

            await project.addHostFileToProject('MotorVehicles/File.swift', ['MotorVehicles'], 'motor vehicles content')
            await project.addHostFileToProject('Vehicles/File.swift', ['Vehicles'], 'vehicles content')
            await project.removeHostFileFromProject('Vehicles/File.swift')

            expect(await project.getProjectFiles()).toEqual(
                [{
                    bundles: ['MotorVehicles'],
                    content: 'motor vehicles content',
                    relativePath: 'MotorVehicles/File.swift',
                    subId: '',
                }])
        })
    })

    test('removeBundleFromProject', async () => {
        await getProjectWithHostFiles(async project => {

            const bundleName = 'MotorVehicles'
            const containerDirName = `${project.config.hostDirName}/Bjs${bundleName}`
            const bundleDirName = `${bundleName}.bjs.bundle`
            const bundleDirPath = `${containerDirName}/${bundleDirName}`
            const bundleDir = project.config.xcodeProjectDir.getSubDir(containerDirName).getSubDir(bundleDirName)

            let hostDirGroup = project.getGroupByDirPath(containerDirName)
            expect(project.getFile(hostDirGroup, bundleDirPath)).not.toBe(null)
            expect(await bundleDir.exists()).toBe(true)

            await project.removeBundleFromProject(bundleName)

            hostDirGroup = project.getGroupByDirPath(containerDirName)
            expect(project.getFile(hostDirGroup, bundleDirPath)).toBe(null)
            expect(await bundleDir.exists()).toBe(false)
        })
    })

    test('cleanEmptyGroups, empty tree with a bundle', async () => {
        await getProjectWithoutHostFiles(async project1 => {
            await getProjectWithoutHostFiles(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                await project1.addBundleToProject('Vehicles', 'bundle content')
                await project2.addBundleToProject('Vehicles', 'bundle content')
                const bundleDir = project2.config.xcodeProjectDir.getSubDir('HostProject/host/BjsVehicles/Vehicles.bjs.bundle')

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project2.addHostFileToProject(rightFile, ['Vehicles'], 'rightFile')
                await project2.addHostFileToProject(leftFile, ['Vehicles'], 'leftFile')
                const filesDir = project2.config.xcodeProjectDir.getSubDir('HostProject/host/dir')

                await project2.removeHostFileFromProject(rightFile)
                await project2.removeHostFileFromProject(leftFile)

                expect(await bundleDir.exists()).toBe(true)
                expect(await filesDir.exists()).toBe(true)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(await bundleDir.exists()).toBe(true)
                expect(await filesDir.exists()).toBe(false)
                expect(project2.project.hash).toStrictEqual(project1.project.hash)
            })
        })
    })

    test('cleanEmptyGroups, tree with a right leaf file', async () => {
        await getProjectWithoutHostFiles(async project1 => {
            await getProjectWithoutHostFiles(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project1.addHostFileToProject(rightFile, ['Vehicles'], 'rightFile')

                await project2.addHostFileToProject(rightFile, ['Vehicles'], 'rightFile')
                await project2.addHostFileToProject(leftFile, ['Vehicles'], 'leftFile')

                await project2.removeHostFileFromProject(leftFile)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(project2.project.hash).toStrictEqual(project1.project.hash)
            })
        })
    })

    test('cleanEmptyGroups, tree with a left leaf file', async () => {
        await getProjectWithoutHostFiles(async project1 => {
            await getProjectWithoutHostFiles(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project1.addHostFileToProject(leftFile, ['Vehicles'], 'leftFile')

                await project2.addHostFileToProject(leftFile, ['Vehicles'], 'leftFile')
                await project2.addHostFileToProject(rightFile, ['Vehicles'], 'rightFile')

                await project2.removeHostFileFromProject(rightFile)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(project2.project.hash).toStrictEqual(project1.project.hash)
            })
        })
    })

    function testFileKeys(actualGroup, expectedGroup, filesKey) {
        const actualComments = Object.getOwnPropertyNames(actualGroup)
            .filter(key => !key.endsWith('_comment'))
            .map(key => actualGroup[key])
            .flatMap(group => group[filesKey].map(file => file.comment))
            .sort()

        const expectedComments = Object.getOwnPropertyNames(expectedGroup)
            .filter(key => !key.endsWith('_comment'))
            .map(key => expectedGroup[key])
            .flatMap(group => group[filesKey].map(file => file.comment))
            .sort()

        expect(actualComments.length).toBeGreaterThan(0)
        expect(actualComments).toEqual(expectedComments)
    }

    function testCommentKeys(actualGroup, expectedGroup, filesKey) {
        const actualComments = Object.getOwnPropertyNames(actualGroup)
            .filter(key => key.endsWith('_comment'))
            .map(key => actualGroup[key])
            .sort()

        const expectedComments = Object.getOwnPropertyNames(expectedGroup)
            .filter(key => key.endsWith('_comment'))
            .map(key => expectedGroup[key])
            .sort()

        expect(actualComments.length).toBeGreaterThan(0)
        expect(actualComments).toEqual(expectedComments)

        if (filesKey) {
            testFileKeys(actualGroup, expectedGroup, filesKey)
        }
    }

    function testProjectObjects(actualObjects, expectedObjects) {
        testCommentKeys(actualObjects.PBXBuildFile, expectedObjects.PBXBuildFile)
        testCommentKeys(actualObjects.PBXFileReference, expectedObjects.PBXFileReference)
        testCommentKeys(actualObjects.PBXFrameworksBuildPhase, expectedObjects.PBXFrameworksBuildPhase, 'files')
        testCommentKeys(actualObjects.PBXGroup, expectedObjects.PBXGroup, 'children')
        testCommentKeys(actualObjects.PBXNativeTarget, expectedObjects.PBXNativeTarget, 'buildPhases')
        testCommentKeys(actualObjects.PBXProject, expectedObjects.PBXProject, 'targets')
        testCommentKeys(actualObjects.PBXResourcesBuildPhase, expectedObjects.PBXResourcesBuildPhase, 'files')
        testCommentKeys(actualObjects.PBXSourcesBuildPhase, expectedObjects.PBXSourcesBuildPhase, 'files')
        testCommentKeys(actualObjects.PBXVariantGroup, expectedObjects.PBXVariantGroup, 'children')
    }

    test('add and remove host files and bundles', async () => {
        await getProjectWithHostFiles(async projWithHostFiles => {
            await getProjectWithoutHostFiles(async project => {
                // Save hashes of the empty project
                const projectWithoutFilesHashes = JSON.parse(JSON.stringify(project.project.hash.project.objects))

                // Add files and bundles to the empty project
                const hostDir = projWithHostFiles.config.hostDir
                for (const hostFileInfo of hostFiles) {
                    const hostFile = hostDir.getSubFile(hostFileInfo.path)
                    await project.addHostFileToProject(hostFileInfo.path, hostFileInfo.bundles, await hostFile.getCodeContent())
                }
                for (const bundleFileInfo of bundleFiles) {
                    const bundleFile = hostDir.getSubFile(bundleFileInfo.path)
                    await project.addBundleToProject(bundleFileInfo.bundle, await bundleFile.getCodeContent())
                }

                // Save and check the correct modification date of the project files
                const statsPreTouch = fs.statSync(project.config.projectPath)
                const modifiedTimePreTouch = statsPreTouch.mtimeMs
                const accessedTimePreTouch = statsPreTouch.atimeMs
                await new Promise(resolve => {
                    setTimeout(resolve, 1000)
                })

                await project.save()

                const statsAfterTouch = fs.statSync(project.config.projectPath)
                const modifiedTimeAfterTouch = statsAfterTouch.mtimeMs
                const accessedTimeAfterTouch = statsAfterTouch.atimeMs

                expect(modifiedTimeAfterTouch).toBeGreaterThan(modifiedTimePreTouch)
                expect(accessedTimeAfterTouch).toBeGreaterThan(accessedTimePreTouch)

                // Re-load the project
                let reloadedProject = xcode.project(project.config.xcodeProjectFile.path).parseSync()

                // Check the hashes
                let actualHashes = reloadedProject.hash.project.objects
                const expectedHashes = projWithHostFiles.project.hash.project.objects
                testProjectObjects(actualHashes, expectedHashes)

                reloadedProject = xcode.project(project.config.xcodeProjectFile.path).parseSync()

                // Remove files and bundles from the reloaded project
                for (const hostFileInfo of hostFiles) {
                    await project.removeHostFileFromProject(hostFileInfo.path)
                }
                for (const bundleFileInfo of bundleFiles) {
                    await project.removeBundleFromProject(bundleFileInfo.bundle)
                }

                // Save
                await project.save()

                // Re-re-load the project
                reloadedProject = xcode.project(project.config.xcodeProjectFile.path).parseSync()

                // Check the hashes
                actualHashes = reloadedProject.hash.project.objects
                testProjectObjects(actualHashes, projectWithoutFilesHashes)
            })
        })
    })

    test('save', async () => {
        await getProjectWithoutHostFiles(async project => {

            const hostFilePath = 'dir1/host.swift'
            const bundleName = 'Vehicles'

            await project.addHostFileToProject(hostFilePath, [bundleName], 'hostFile')
            await project.addBundleToProject(bundleName, 'bundleContent')

            const hostDir = project.config.xcodeProjectDir.getSubDir('HostProject/host')
            const bundleDir = project.config.xcodeProjectDir.getSubDir(`HostProject/host/Bjs${bundleName}/${bundleName}.bjs.bundle`)

            const hostFile = hostDir.getSubDir('dir1').getSubFile('host.swift')
            const bundleFile = bundleDir.getSubFile(`${bundleName}.js`)
            expect(await hostFile.exists()).toBe(true)
            expect(await bundleFile.exists()).toBe(true)

            await project.save()

            let freshLoadedProject = new XcodeHostProject(project.config, project.log)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).not.toBe(null)

            await freshLoadedProject.removeHostFileFromProject(hostFilePath)
            await freshLoadedProject.removeBundleFromProject(bundleName)

            expect(await hostFile.exists()).toBe(false)
            expect(await hostFile.dir.exists()).toBe(true)
            expect(await bundleDir.exists()).toBe(false)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).not.toBe(null)

            // Save triggers cleanEmptyDirs() to clean host files empty directories
            await freshLoadedProject.save()

            // Check that host files empty directories died
            expect(await hostDir.exists()).toBe(true)
            expect(await hostFile.dir.exists()).toBe(false)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).toBe(null)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host')).not.toBe(null)
        })
    })

    test('ensureGroupExists', async () => {
        await getProjectWithHostDirs(async projectWithHostDirs => {
            await getProjectWithoutHostFiles(async projectWithoutHost => {

                projectWithoutHost.cleanEmptyDirs = t.mockFn() // disable empty groups cleaning
                XcodeHostProject.encodePath = t.mockFn(path => path)

                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/libs'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/libs'))
                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/native'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/native'))
                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/BjsMotorVehicles'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/BjsMotorVehicles'))
                expect(await projectWithoutHost.ensureGroupExists('/HostProject/host/BjsVehicles'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host/BjsVehicles'))
                await projectWithoutHost.save()

                let freshLoadedProjectWithoutHost = xcode.project(projectWithoutHost.config.xcodeProjectFile.path).parseSync()
                testProjectObjects(freshLoadedProjectWithoutHost.hash.project.objects, projectWithHostDirs.project.hash.project.objects)

                expect(await projectWithoutHost.ensureGroupExists('HostProject/host'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject/host'))
                expect(await projectWithoutHost.ensureGroupExists('HostProject'))
                    .toStrictEqual(projectWithoutHost.getGroupByDirPath('/HostProject'))
                await projectWithoutHost.save()

                freshLoadedProjectWithoutHost = xcode.project(projectWithoutHost.config.xcodeProjectFile.path).parseSync()
                testProjectObjects(freshLoadedProjectWithoutHost.hash.project.objects, projectWithHostDirs.project.hash.project.objects)

                expect(XcodeHostProject.encodePath).toHaveBeenCalledTimes(4)
                expect(XcodeHostProject.encodePath).toHaveBeenCalledWith('libs')
                expect(XcodeHostProject.encodePath).toHaveBeenCalledWith('native')
                expect(XcodeHostProject.encodePath).toHaveBeenCalledWith('BjsVehicles')
                expect(XcodeHostProject.encodePath).toHaveBeenCalledWith('BjsMotorVehicles')
            })
        })
    })
})