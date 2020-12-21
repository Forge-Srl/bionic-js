const t = require('../test-utils')
const copydir = require('copy-dir')

describe('JavaHostProject', () => {

    let JavaHostProject, BjsConfiguration, HostProjectFile, BundleProjectFile, Directory, log

    beforeEach(() => {
        JavaHostProject = t.requireModule('filesystem/JavaHostProject').JavaHostProject
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
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/java/${projectDirName}/`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})
            const config = new BjsConfiguration(JSON.parse(testConfigJson)).hostProjects[1]
            config.configObj.projectPath = tempDir.absolutePath
            await codeUsingProject(new JavaHostProject(config, log))
        })
    }

    async function getProjectWithoutHostFiles(codeUsingProject) {
        return getProject('project-without-host', codeUsingProject)
    }

    async function getProjectWithHostFiles(codeUsingProject) {
        return getProject('project-with-host-files', codeUsingProject)
    }

    test('getProjectFiles', async () => {
        await getProjectWithHostFiles(async project => {
            const files = (await project.getProjectFiles()).sort((file1, file2) => file1.id < file2.id ? -1 : file1.id > file2.id ? 1 : 0)
            expect(files.map(file => file.id)).toStrictEqual([
                'Bicycle.java', 'BjsMotorVehicles/BjsBeautifulVehicles.java', 'BjsVehicles/BjsBeautifulVehicles.java',
                'FerrariCalifornia.java', 'MotorVehicles', 'TeslaRoadster.java', 'Vehicles', 'libs/FuelType.java',
                'libs/MotorVehicle.java', 'libs/Vehicle.java', 'native/BaseEngineBjsExport.java',
                'native/EngineBjsExport.java',
            ])
            expect(files.map(file => file.constructor.name)).toStrictEqual([
                'HostProjectFile', 'HostProjectFile', 'HostProjectFile', 'HostProjectFile',
                'BundleProjectFile', 'HostProjectFile', 'BundleProjectFile', 'HostProjectFile', 'HostProjectFile',
                'HostProjectFile', 'HostProjectFile', 'HostProjectFile',
            ])
            expect(files.map(file => file.bundles)).toStrictEqual([
                ['main'], ['main'], ['main'],
                ['main'], ['main'], ['main'], ['main'], ['main'],
                ['main'], ['main'], ['main'],
                ['main'],
            ])
            expect(files.map(file => file.content.length)).toStrictEqual([650, 550, 364, 659, 13553, 1035, 3774, 1547,
                2495, 1089, 3292, 2666])
        })
    })

    test('removeHostFileFromProject', async () => {
        await getProjectWithHostFiles(async project => {

            const fileName = 'BjsMotorVehicles/BjsBeautifulVehicles.java'
            const hostFile = project.config.hostDir.getSubFile(fileName)
            expect(await hostFile.exists()).toBe(true)
            await project.removeHostFileFromProject(fileName)
            expect(await hostFile.exists()).toBe(false)
        })
    })

    test('removeHostFileFromProject, two files with same name and one is removed', async () => {
        await getProjectWithoutHostFiles(async project => {

            await project.addHostFileToProject('MotorVehicles/File.java', ['main'], 'motor vehicles content')
            await project.addHostFileToProject('Vehicles/File.java', ['main'], 'vehicles content')
            await project.removeHostFileFromProject('Vehicles/File.java')

            expect(await project.getProjectFiles()).toEqual(
                [{
                    bundles: ['main'],
                    content: 'motor vehicles content',
                    relativePath: 'MotorVehicles/File.java',
                }])
        })
    })

    test('removeBundleFromProject', async () => {
        await getProjectWithHostFiles(async project => {
            const bundleName = 'MotorVehicles'
            const bundleDirName = `${bundleName}.bjs.bundle`
            const bundleDir = project.config.resourcesDir.getSubDir(bundleDirName)
            expect(await bundleDir.exists()).toBe(true)
            await project.removeBundleFromProject(bundleName)
            expect(await bundleDir.exists()).toBe(false)
        })
    })

    test('save', async () => {
        await getProjectWithoutHostFiles(async project => {

            const hostFilePath = 'dir1/host.java'
            const bundleName = 'Vehicles'

            await project.addHostFileToProject(hostFilePath, [bundleName], 'hostFile')
            await project.addBundleToProject(bundleName, 'bundleContent')

            const hostDir = project.config.hostDir
            const bundleDir = project.config.resourcesDir.getSubDir(`${bundleName}.bjs.bundle`)

            const hostFile = hostDir.getSubDir('dir1').getSubFile('host.java')
            const bundleFile = bundleDir.getSubFile(`${bundleName}.js`)
            expect(await hostFile.exists()).toBe(true)
            expect(await bundleFile.exists()).toBe(true)

            await project.removeHostFileFromProject(hostFilePath)
            await project.removeBundleFromProject(bundleName)

            expect(await hostFile.exists()).toBe(false)
            expect(await hostFile.dir.exists()).toBe(true)
            expect(await bundleDir.exists()).toBe(false)

            await project.save()

            // Check that host files empty directories died
            expect(await hostDir.exists()).toBe(true)
            expect(await hostFile.dir.exists()).toBe(false)
        })
    })
})