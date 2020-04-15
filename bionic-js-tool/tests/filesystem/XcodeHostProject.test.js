const t = require('../test-utils')
const copydir = require('copy-dir')
const xcode = require('xcode')
const {hostFilePaths, packageFilePaths} = require('../../testing-code/swift/files')
const fs = require('fs')

describe('XcodeHostProject', () => {

    let XcodeHostProject, ConfigurationHostTarget, File, Directory, log

    beforeEach(() => {
        XcodeHostProject = t.requireModule('filesystem/XcodeHostProject').XcodeHostProject
        ConfigurationHostTarget = t.requireModule('filesystem/configuration/XcodeHostTargetConfiguration').XcodeHostTargetConfiguration
        File = t.requireModule('filesystem/File').File
        Directory = t.requireModule('filesystem/Directory').Directory
        const Log = t.requireModule('filesystem/Log').Log
        log = new Log(true)
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
        await getProjectWithoutHost(async project => {
            const mainGroup = project.mainGroup

            expect(mainGroup.relativePath).toBe('')
            expect(mainGroup.debugLocation).toBe('Project')

            const mainGroupChildren = mainGroup.children
            expect(mainGroupChildren.length).toBe(2)
            expect(mainGroupChildren[0].comment).toBe('HostProject')
            expect(mainGroupChildren[1].comment).toBe('Products')
        })
    })

    test('compileTargetKeys', async () => {
        await getProjectWithoutHost(async project => {
            const targetKeys = project.compileTargetKeys
            expect(targetKeys).toStrictEqual(['C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C'])
        })
    })

    test('compileTargetKeys, wrong targets in config', async () => {
        await getProjectWithoutHost(async project => {
            project.targetConfig.targetObj.compileTargets = ['HostProject', 'WrongTarget']

            expect(() => project.compileTargetKeys).toThrow('compile target "WrongTarget" not found in the project')
        })
    })

    test('allTargetKeys', async () => {
        await getProjectWithoutHost(async project => {
            const allTargetKeys = project.allTargetKeys
            expect(allTargetKeys).toStrictEqual(['C5966C8C2349378B00EE670C', 'C5B809F02349FE28002FD95C', 'C5B809FF2349FF10002FD95C'])
        })
    })

    test('encodePath', () => {
        const project = new XcodeHostProject()
        expect(project.encodePath('standard/path')).toBe('standard/path')
        expect(project.encodePath('standard-path')).toBe('standard-path')
    })

    test('encodePath, null path', () => {
        const project = new XcodeHostProject()
        expect(project.encodePath('')).toBe('')
        expect(project.encodePath(null)).toBe(null)
        expect(project.encodePath(undefined)).toBe(undefined)
    })

    test('encodePath, with quotes', () => {
        const project = new XcodeHostProject()
        expect(project.encodePath('quoted/"/"/path')).toBe('"quoted/\\"/\\"/path"')
    })

    test('decodePath', () => {
        const project = new XcodeHostProject()
        expect(project.decodePath('standard/path')).toBe('standard/path')
    })

    test('decodePath, null path', () => {
        const project = new XcodeHostProject()
        expect(project.decodePath('')).toBe('')
        expect(project.decodePath('""')).toBe('')
        expect(project.decodePath(null)).toBe(null)
        expect(project.decodePath(undefined)).toBe(undefined)
    })

    test('decodePath, quoted path', () => {
        const project = new XcodeHostProject()
        expect(project.decodePath('"quoted/path"')).toBe('quoted/path')
    })

    test('decodePath, quoted path, with new line', () => {
        const project = new XcodeHostProject()
        expect(project.decodePath('"quoted/\n/path"')).toBe('quoted/\n/path')
    })

    test('decodePath, quoted path, with escaped quotes', () => {
        const project = new XcodeHostProject()
        expect(project.decodePath('"quoted/\\"/\\"/path"')).toBe('quoted/"/"/path')
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

            expect(log.warningLog).toBe('"HostProject.app": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')
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

    test('getGroupByDirPath', async () => {
        await getProjectWithoutHost(async project => {
            const libsGroup = project.getGroupByDirPath('HostProject')
            const sameLibsGroup = project.getGroupByDirPath('/HostProject')

            expect(log.warningLog).toBe('')

            expect(sameLibsGroup).toEqual(libsGroup)
            expect(libsGroup.relativePath).toBe('HostProject')
            expect(libsGroup.debugLocation).toBe('Project/HostProject')
            expect(libsGroup.children.length).toBe(11)
        })
    })

    test('getGroupByDirPath, path of a file', async () => {
        await getProjectWithoutHost(async project => {
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
        await getProjectWithoutHost(async project => {
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

            project.decodePath = t.mockFn(path => path)
            const files = project.getFiles(hostProjectGroup)
            expect(files.map(file => file.path)).toStrictEqual([
                'Bjs.framework', 'BjsEnvironment.swift', 'FerrariCalifornia.swift', 'TeslaRoadster.swift',
                'MotorVehicle.swift', 'Vehicle.swift', 'EngineWrapper.swift', 'package.bundle'])

            expect(files.map(file => file.relativePath)).toStrictEqual([
                'HostProject/Bjs.framework', 'HostProject/host/BjsEnvironment.swift',
                'HostProject/host/FerrariCalifornia.swift', 'HostProject/host/TeslaRoadster.swift',
                'HostProject/host/libs/MotorVehicle.swift', 'HostProject/host/libs/Vehicle.swift',
                'HostProject/host/native/EngineWrapper.swift', 'HostProject/host/package.bundle'])

            expect(files.map(file => file.debugLocation)).toStrictEqual([
                'Project/HostProject/Bjs/Bjs.framework', 'Project/HostProject/Bjs/host/BjsEnvironment.swift',
                'Project/HostProject/Bjs/host/FerrariCalifornia.swift', 'Project/HostProject/Bjs/host/TeslaRoadster.swift',
                'Project/HostProject/Bjs/host/libs/MotorVehicle.swift', 'Project/HostProject/Bjs/host/libs/Vehicle.swift',
                'Project/HostProject/Bjs/host/native/EngineWrapper.swift', 'Project/HostProject/Bjs/host/package.bundle'])

            expect(project.decodePath).toHaveBeenCalledTimes(12) // 8 files + 4 dirs
        })
    })

    test('getFile', async () => {
        await getProjectWithHostFiles(async project => {
            const sourceFile = project.getFile(hostProjectGroup, 'HostProject/host/native/EngineWrapper.swift')
            expect(sourceFile).toMatchObject({
                fatherGroup: {
                    debugLocation: 'Project/HostProject/Bjs/host/native',
                    key: 'C5B80A37234A1A0E002FD95C',
                    path: 'native',
                    relativePath: 'HostProject/host/native',
                },
                file: {
                    debugLocation: 'Project/HostProject/Bjs/host/native/EngineWrapper.swift',
                    key: 'C5B80A38234A1A8B002FD95C',
                    path: 'EngineWrapper.swift',
                    relativePath: 'HostProject/host/native/EngineWrapper.swift',
                },
            })

            const bundleFile = project.getFile(hostProjectGroup, '/HostProject/host/package.bundle')
            expect(bundleFile).toMatchObject({
                fatherGroup: {
                    debugLocation: 'Project/HostProject/Bjs/host',
                    key: 'C5B80A14234A19DB002FD95C',
                    path: 'host',
                    relativePath: 'HostProject/host',
                },
                file: {
                    debugLocation: 'Project/HostProject/Bjs/host/package.bundle',
                    key: 'C5B80A3B234A1A8B002FD95C',
                    path: 'package.bundle',
                    relativePath: 'HostProject/host/package.bundle',
                },
            })
        })
    })

    test('getHostFiles', async () => {
        await getProjectWithHostFiles(async project => {
            const files = await project.getHostFiles()
            expect(files.map(file => file.relativePath)).toStrictEqual([
                'BjsEnvironment.swift', 'FerrariCalifornia.swift', 'TeslaRoadster.swift', 'libs/MotorVehicle.swift',
                'libs/Vehicle.swift', 'native/EngineWrapper.swift',
            ])
            expect(files[0].rootDirPath).toBe(project.targetConfig.hostDirPath)
        })
    })

    const wrongHostFilesTypeError = '"HostProject/Bjs.framework", ' +
        '"HostProject/SceneDelegate.swift", "HostProject/Assets.xcassets", "HostProject/target1.plist", ' +
        '"HostProject/target2.plist", "HostProject/target3.plist" not supported: only .swift source files and ' +
        'bundles can be placed inside the host directory'

    test('getHostFiles, wrong host files type', async () => {
        await getProjectWithHostFiles(async project => {
            t.mockGetter(project.targetConfig, 'hostDirName', () => 'HostProject')
            expect(project.getHostFiles()).rejects.toThrow(wrongHostFilesTypeError)
        })
    })

    test('getPackageFiles', async () => {
        await getProjectWithHostFiles(async project => {
            const files = await project.getPackageFiles()
            expect(files.map(file => file.relativePath)).toStrictEqual([
                'BjsNativeObject.js', 'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js', 'package.json',
                'node_modules/module-c/ModuleC.js', 'node_modules/module-c/package.json',
                'node_modules/module-c/node_modules/module-b/ModuleB.js',
                'node_modules/module-c/node_modules/module-b/package.json',
                'node_modules/module-b/ModuleB.js', 'node_modules/module-b/package.json',
                'node_modules/module-a/ModuleA.js', 'node_modules/module-a/package.json', 'native/Engine.js',
                'native/fuelCosts.js', 'libs/MotorVehicle.js', 'libs/Vehicle.js',
            ])
            expect(files[0].rootDirPath).toBe(project.targetConfig.packageDirPath)
        })
    })

    test('getPackageFiles, wrong host files type', async () => {
        await getProjectWithHostFiles(async project => {
            t.mockGetter(project.targetConfig, 'packageDirPath', () => (project.targetConfig.hostDirPath + '/libs'))
            expect(project.getPackageFiles()).rejects.toThrow('"MotorVehicle.swift", "Vehicle.swift" not ' +
                'supported: only Javascript source files can be placed inside the package directory')
        })
    })

    test('removeHostFile', async () => {
        await getProjectWithHostFiles(async project => {

            const fileName = 'libs/Vehicle.swift'
            const hostDirName = project.targetConfig.hostDirName
            const fileRelativePath = `${hostDirName}/${fileName}`
            const hostFile = project.xcodeProjectDir.getSubDir(project.targetConfig.hostDirName).getSubFile(fileName)


            let hostDirGroup = project.getGroupByDirPath(hostDirName)
            expect(project.getFile(hostDirGroup, fileRelativePath)).not.toBe(null)
            expect(await hostFile.exists()).toBe(true)

            await project.removeHostFile(fileName)

            hostDirGroup = project.getGroupByDirPath(hostDirName)
            expect(project.getFile(hostDirGroup, fileRelativePath)).toBe(null)
            expect(await hostFile.exists()).toBe(false)
        })
    })

    test('removePackageFile', async () => {
        await getProjectWithHostFiles(async project => {

            const fileName = 'node_modules/module-c/package.json'
            const packageFile = project.xcodeProjectDir.getSubDir(project.targetConfig.hostDirName)
                .getSubDir(project.targetConfig.packageName).getSubFile(fileName)

            expect(await packageFile.exists()).toBe(true)

            await project.removePackageFile(fileName)

            expect(await packageFile.exists()).toBe(false)
        })
    })

    test('cleanEmptyGroups, empty tree with a package file', async () => {
        await getProjectWithoutHost(async project1 => {
            await getProjectWithoutHost(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project1.setPackageFileContent('packageFile', 'packageFile')
                await project2.setPackageFileContent('packageFile', 'packageFile')
                const packageDir = project2.xcodeProjectDir.getSubDir('HostProject/host/package.bundle')

                await project2.setHostFileContent(rightFile, 'rightFile')
                await project2.setHostFileContent(leftFile, 'leftFile')
                const filesDir = project2.xcodeProjectDir.getSubDir('HostProject/host/dir')

                await project2.removeHostFile(rightFile)
                await project2.removeHostFile(leftFile)

                expect(await packageDir.exists()).toBe(true)
                expect(await filesDir.exists()).toBe(true)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(await packageDir.exists()).toBe(true)
                expect(await filesDir.exists()).toBe(false)
                expect(project2.project.hash).toStrictEqual(project1.project.hash)
            })
        })
    })

    test('cleanEmptyGroups, tree with a right leaf file', async () => {
        await getProjectWithoutHost(async project1 => {
            await getProjectWithoutHost(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project1.setHostFileContent(rightFile, 'rightFile')

                await project2.setHostFileContent(rightFile, 'rightFile')
                await project2.setHostFileContent(leftFile, 'leftFile')

                await project2.removeHostFile(leftFile)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(project2.project.hash).toStrictEqual(project1.project.hash)
            })
        })
    })

    test('cleanEmptyGroups, tree with a left leaf file', async () => {
        await getProjectWithoutHost(async project1 => {
            await getProjectWithoutHost(async project2 => {

                let project1Hash = 0
                project1.project.generateUuid = () => `HASH_${project1Hash++}`

                let project2Hash = 0
                project2.project.generateUuid = () => `HASH_${project2Hash++}`

                const leftFile = 'dir/dirL/dirLL/leftFile.swift'
                const rightFile = 'dir/dirR/dirRR/rightFile.swift'
                await project1.setHostFileContent(leftFile, 'leftFile')

                await project2.setHostFileContent(leftFile, 'leftFile')
                await project2.setHostFileContent(rightFile, 'rightFile')

                await project2.removeHostFile(rightFile)

                const hostGroup = project2.getGroupByDirPath('HostProject/host')
                await project2.cleanEmptyGroups(hostGroup)

                expect(project2.project.hash).toStrictEqual(project1.project.hash)
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
                uuidFn.mockReturnValueOnce('C5B80A15234A1A0E002FD95C') // PBXFile: BjsEnvironment.swift
                uuidFn.mockReturnValueOnce('C5B80A24234A1A0E002FD95C') // PBXBuildFile (target1): BjsEnvironment.swift
                uuidFn.mockReturnValueOnce('C5B80A25234A1A0E002FD95C') // PBXBuildFile (target2): BjsEnvironment.swift

                uuidFn.mockReturnValueOnce('C5B80A19234A1A0E002FD95C') // PBXFile: FerrariCalifornia.swift
                uuidFn.mockReturnValueOnce('C5B80A2A234A1A0E002FD95C') // PBXBuildFile (target1): FerrariCalifornia.swift
                uuidFn.mockReturnValueOnce('C5B80A2B234A1A0E002FD95C') // PBXBuildFile (target2): FerrariCalifornia.swift

                uuidFn.mockReturnValueOnce('C5B80A16234A1A0E002FD95C') // PBXFile: TeslaRoadster.swift
                uuidFn.mockReturnValueOnce('C5B80A18234A1A0E002FD95C') // PBXBuildFile (target1): TeslaRoadster.swift
                uuidFn.mockReturnValueOnce('C5B80A28234A1A0E002FD95C') // PBXBuildFile (target2): TeslaRoadster.swift

                uuidFn.mockReturnValueOnce('C5B80A29234A1A0E002FD95C') // PBXGroup: libs

                uuidFn.mockReturnValueOnce('C5B80A17234A1A0E002FD95C') // PBXFile: libs/MotorVehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A26234A1A0E002FD95C') // PBXBuildFile (target1): MotorVehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A27234A1A0E002FD95C') // PBXBuildFile (target2): MotorVehicle.swift

                uuidFn.mockReturnValueOnce('C5B80A22234A1A0E002FD95C') // PBXFile: libs/Vehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A23234A1A0E002FD95C') // PBXBuildFile (target1): Vehicle.swift
                uuidFn.mockReturnValueOnce('C5B80A36234A1A0E002FD95C') // PBXBuildFile (target2): Vehicle.swift

                uuidFn.mockReturnValueOnce('C5B80A37234A1A0E002FD95C') // PBXGroup: native

                uuidFn.mockReturnValueOnce('C5B80A38234A1A8B002FD95C') // PBXFile: native/EngineWrapper.swift
                uuidFn.mockReturnValueOnce('C5B80A39234A1A8B002FD95C') // PBXBuildFile (target1): EngineWrapper.swift
                uuidFn.mockReturnValueOnce('C5B80A3A234A1A8B002FD95C') // PBXBuildFile (target2): EngineWrapper.swift

                uuidFn.mockReturnValueOnce('C5B80A3B234A1A8B002FD95C') // PBXFile: package.bundle
                uuidFn.mockReturnValueOnce('C5B80A3C234A1A8B002FD95C') // PBXBuildFile (target1): package.bundle
                uuidFn.mockReturnValueOnce('C5B80A3D234A1A8B002FD95C') // PBXBuildFile (target2): package.bundle

                projWithoutHost.encodePath = t.mockFn(path => path)


                const hostDirPath = projWithHostFiles.targetConfig.hostDirPath
                for (const hostFilePath of hostFilePaths) {
                    const hostFile = new Directory(hostDirPath).getSubFile(hostFilePath)
                    await projWithoutHost.setHostFileContent(hostFilePath, await hostFile.getContent())
                }
                for (const packageFilePath of packageFilePaths) {
                    const packageFile = new Directory(hostDirPath).getSubDir('package.bundle').getSubFile(packageFilePath)
                    await projWithoutHost.setPackageFileContent(packageFilePath, await packageFile.getContent())
                }

                const statsPreTouch = fs.statSync(projWithoutHost.targetConfig.xcodeProjectPath)
                const modifiedTimePreTouch = statsPreTouch.mtimeMs
                const accessedTimePreTouch = statsPreTouch.atimeMs
                await new Promise(resolve => {
                    setTimeout(resolve, 1000)
                })

                await projWithoutHost.save()

                const statsAfterTouch = fs.statSync(projWithoutHost.targetConfig.xcodeProjectPath)
                const modifiedTimeAfterTouch = statsAfterTouch.mtimeMs
                const accessedTimeAfterTouch = statsAfterTouch.atimeMs

                expect(modifiedTimeAfterTouch).toBeGreaterThan(modifiedTimePreTouch)
                expect(accessedTimeAfterTouch).toBeGreaterThan(accessedTimePreTouch)

                const freshProjWithoutHost = xcode.project(projWithoutHost.targetConfig.xcodeProjectFilePath).parseSync()

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXGroup, 'children')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXGroup, 'children')

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXResourcesBuildPhase, 'files')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXResourcesBuildPhase, 'files')

                orderSubArray(freshProjWithoutHost.hash.project.objects.PBXSourcesBuildPhase, 'files')
                orderSubArray(projWithHostFiles.project.hash.project.objects.PBXSourcesBuildPhase, 'files')

                expect(freshProjWithoutHost.hash).toStrictEqual(projWithHostFiles.project.hash)
                expect(projWithoutHost.encodePath).toHaveBeenCalledTimes(9)
            })
        })
    })

    test('save and cleanEmptyDirs', async () => {
        await getProjectWithoutHost(async project => {

            const hostFilePath = 'dir1/host.swift'
            const packageFilePath = 'dirA/package.js'

            await project.setHostFileContent(hostFilePath, 'hostFile')
            await project.setPackageFileContent(packageFilePath, 'packageFile')

            const hostDir = project.xcodeProjectDir.getSubDir('HostProject/host')
            const packageDir = project.xcodeProjectDir.getSubDir('HostProject/host/package.bundle')

            const hostFile = hostDir.getSubDir('dir1').getSubFile('host.swift')
            const packageFile = packageDir.getSubDir('dirA').getSubFile('package.js')
            expect(await hostFile.exists()).toBe(true)
            expect(await packageFile.exists()).toBe(true)

            await project.save()

            let freshLoadedProject = new XcodeHostProject(project.targetConfig, project.log)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).not.toBe(null)

            await freshLoadedProject.removeHostFile(hostFilePath)
            await freshLoadedProject.removePackageFile(packageFilePath)

            expect(await hostFile.exists()).toBe(false)
            expect(await packageFile.exists()).toBe(false)
            expect(await hostFile.dir.exists()).toBe(true)
            expect(await packageFile.dir.exists()).toBe(true)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).not.toBe(null)

            await freshLoadedProject.save()

            expect(await hostDir.exists()).toBe(true)
            expect(await packageDir.exists()).toBe(true)
            expect(await hostFile.dir.exists()).toBe(false)
            expect(await packageFile.dir.exists()).toBe(false)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host/dir1')).toBe(null)
            expect(freshLoadedProject.getGroupByDirPath('HostProject/host')).not.toBe(null)
        })
    })

    test('ensureGroupExists', async () => {
        await getProjectWithHostDirs(async projectWithHostDirs => {
            await getProjectWithoutHost(async projectWithoutHost => {

                projectWithoutHost.cleanEmptyDirs = t.mockFn() // disable empty groups cleaning

                expect(projectWithoutHost.project.generateUuid().length).toBe(24)
                projectWithoutHost.project.generateUuid = t.mockFn()
                projectWithoutHost.project.generateUuid.mockReturnValueOnce('C5B80A16234A1A0E002FD95C') // PBXGroup: libs
                projectWithoutHost.project.generateUuid.mockReturnValueOnce('C5B80A22234A1A0E002FD95C') // PBXGroup: native
                projectWithoutHost.encodePath = t.mockFn(path => path)

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
                expect(projectWithoutHost.encodePath).toHaveBeenCalledTimes(2)
                expect(projectWithoutHost.encodePath).toHaveBeenCalledWith('libs')
                expect(projectWithoutHost.encodePath).toHaveBeenCalledWith('native')
            })
        })
    })
})