const t = require('../test-utils')
const copydir = require('copy-dir')

describe('HostProject', () => {

    let HostProject, BjsConfiguration, Directory, log, stats

    beforeEach(() => {
        HostProject = t.requireModule('filesystem/HostProject').HostProject
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
        Directory = t.requireModule('filesystem/Directory').Directory
        const Log = t.requireModule('filesystem/Log').Log
        log = new Log()
        const BjsSyncStats = t.requireModule('filesystem/BjsSyncStats').BjsSyncStats
        stats = new BjsSyncStats()
    })

    async function getProjectWithoutHostFiles(codeUsingProject) {
        return getProject('project-without-host', codeUsingProject)
    }

    async function getProjectWithHostFiles(codeUsingProject) {
        return getProject('project-with-host-files', codeUsingProject)
    }

    const getProject = async (projectDirName, codeUsingProject) => {
        const testConfig = BjsConfiguration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
        const testConfigJson = JSON.stringify(testConfig.configObj)

        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectDirName}/`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})
            const config = new BjsConfiguration(JSON.parse(testConfigJson)).hostProjects[0]
            config.configObj.projectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            await codeUsingProject(HostProject.build(config, log, stats))
        })
    }

    test('delete files', async () => {
        await getProjectWithHostFiles(async hostProject => {
            await hostProject.open()
            const diff = hostProject.projectFilesDiff

            expect(diff.filesToAdd).toStrictEqual([])

            expect(diff.filesToUpdate).toStrictEqual([])

            expect(diff.filesToDelete).toMatchObject([
                {relativePath: 'Bicycle.swift', bundles: ['Vehicles']},
                {relativePath: 'FerrariCalifornia.swift', bundles: ['MotorVehicles']},
                {relativePath: 'TeslaRoadster.swift', bundles: ['MotorVehicles']},
                {relativePath: 'libs/FuelType.swift', bundles: ['MotorVehicles']},
                {relativePath: 'libs/MotorVehicle.swift', bundles: ['MotorVehicles']},
                {relativePath: 'libs/Vehicle.swift', bundles: ['Vehicles', 'MotorVehicles']},
                {relativePath: 'native/BaseEngineBjsWrapper.swift', bundles: ['MotorVehicles']},
                {relativePath: 'native/EngineBjsWrapper.swift', bundles: ['MotorVehicles']},
                {relativePath: 'BjsMotorVehicles/BjsBeautifulVehicles.swift', bundles: ['MotorVehicles']},
                {bundleName: 'MotorVehicles', bundles: ['MotorVehicles']},
                {relativePath: 'BjsVehicles/BjsBeautifulVehicles.swift', bundles: ['Vehicles']},
                {bundleName: 'Vehicles', bundles: ['Vehicles']},
            ])

            await hostProject.save()
            hostProject.targetProject._project = null // To force project file reload
            await hostProject.open()

            expect([...hostProject.oldFiles.entries()]).toEqual([])
        })
    })

    test('add files', async () => {
        await getProjectWithoutHostFiles(async hostProject => {
            await hostProject.open()

            hostProject.setHostFileContent('relative/path/file1.swift', ['Vehicles'], 'file1 content')
            hostProject.setHostFileContent('file2.swift', ['Vehicles', 'MotorVehicles'], 'file2 content')
            hostProject.setBundleFileContent('Vehicles', 'Vehicles bundle content')

            const diff = hostProject.projectFilesDiff

            expect(diff.filesToAdd).toMatchObject([
                {relativePath: 'relative/path/file1.swift', bundles: ['Vehicles'], content: 'file1 content'},
                {relativePath: 'file2.swift', bundles: ['Vehicles', 'MotorVehicles'], content: 'file2 content'},
                {bundleName: 'Vehicles', bundles: ['Vehicles'], content: 'Vehicles bundle content'},
            ])

            expect(diff.filesToUpdate).toEqual([])

            expect(diff.filesToDelete).toEqual([])

            await hostProject.save()
            hostProject.targetProject._project = null // To force project file reload
            await hostProject.open()

            expect([...hostProject.oldFiles.entries()]).toEqual([
                ['relative/path/file1.swift', {
                    relativePath: 'relative/path/file1.swift', bundles: ['Vehicles'], content: 'file1 content',
                }],
                ['file2.swift', {
                    relativePath: 'file2.swift', bundles: ['Vehicles', 'MotorVehicles'], content: 'file2 content',
                }],
                ['Vehicles', {
                    bundleName: 'Vehicles', bundles: ['Vehicles'], content: 'Vehicles bundle content',
                }],
            ])
        })
    })

    test('update files', async () => {
        await getProjectWithHostFiles(async hostProject => {
            await hostProject.open()

            // Host file: CONTENT: not changed BUNDLES: not changed
            const teslaRoadsterOldContent = hostProject.oldFiles.get('TeslaRoadster.swift').content
            hostProject.setHostFileContent('TeslaRoadster.swift', ['MotorVehicles'], teslaRoadsterOldContent)

            // Host file: CONTENT: not changed BUNDLES: changed
            const ferrariCaliforniaOldContent = hostProject.oldFiles.get('FerrariCalifornia.swift').content
            hostProject.setHostFileContent('FerrariCalifornia.swift', ['Vehicles'], ferrariCaliforniaOldContent)

            // Host file: CONTENT: changed BUNDLES: not changed
            hostProject.setHostFileContent('native/BaseEngineBjsWrapper.swift', ['MotorVehicles'], 'host content')

            // Bundle file: CONTENT: not changed
            const vehiclesOldContent = hostProject.oldFiles.get('Vehicles').content
            hostProject.setBundleFileContent('Vehicles', vehiclesOldContent)

            // Bundle file: CONTENT: changed
            hostProject.setBundleFileContent('MotorVehicles', 'bundle content')

            const diff = hostProject.projectFilesDiff

            expect(diff.filesToAdd).toStrictEqual([])

            expect(diff.filesToUpdate).toMatchObject([
                {relativePath: 'FerrariCalifornia.swift', bundles: ['Vehicles'], content: ferrariCaliforniaOldContent},
                {
                    relativePath: 'native/BaseEngineBjsWrapper.swift', bundles: ['MotorVehicles'],
                    content: 'host content',
                },
                {bundleName: 'MotorVehicles', bundles: ['MotorVehicles'], content: 'bundle content'},
            ])

            expect(diff.filesToDelete.length).toBe(7)

            await hostProject.save()
            hostProject.targetProject._project = null // To force project file reload
            await hostProject.open()

            expect([...hostProject.oldFiles.entries()]).toEqual([
                ['TeslaRoadster.swift', {
                    bundles: ['MotorVehicles'], content: teslaRoadsterOldContent,
                    relativePath: 'TeslaRoadster.swift',
                }],
                ['native/BaseEngineBjsWrapper.swift', {
                    bundles: ['MotorVehicles'], content: 'host content',
                    relativePath: 'native/BaseEngineBjsWrapper.swift',
                }],
                ['MotorVehicles', {
                    bundleName: 'MotorVehicles', bundles: ['MotorVehicles'], content: 'bundle content',
                }],
                ['Vehicles', {
                    bundleName: 'Vehicles', bundles: ['Vehicles'], content: vehiclesOldContent,
                }],
                ['FerrariCalifornia.swift', {
                    bundles: ['Vehicles'], content: ferrariCaliforniaOldContent,
                    relativePath: 'FerrariCalifornia.swift',
                }],
            ])
        })
    })
})