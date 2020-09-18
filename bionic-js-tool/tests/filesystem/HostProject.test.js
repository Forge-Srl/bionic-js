const t = require('../test-utils')
const copydir = require('copy-dir')

describe('HostProject', () => {

    let HostProject, ConfigurationHostTarget, Directory, log, stats

    beforeEach(() => {
        HostProject = t.requireModule('filesystem/HostProject').HostProject
        ConfigurationHostTarget = t.requireModule('filesystem/configuration/XcodeHostTargetConfiguration').XcodeHostTargetConfiguration
        Directory = t.requireModule('filesystem/Directory').Directory
        const Log = t.requireModule('filesystem/Log').Log
        log = new Log()
        const BjsSyncStats = t.requireModule('filesystem/BjsSyncStats').BjsSyncStats
        stats = new BjsSyncStats()
    })

    const getSwiftProject = async codeUsingProject => {
        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/project-with-host-files/`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})
            const targetConfig = new ConfigurationHostTarget({
                hostLanguage: 'Swift',
                xcodeProjectPath: tempDir.getSubFile('HostProject.xcodeproj').absolutePath,
                hostDirName: 'HostProject/host',
                compileTargets: ['HostProject', 'HostProjectTarget2'],
            })
            await codeUsingProject(HostProject.build(targetConfig, log, stats))
        })
    }

    test('hostFilesDiff, delete all', async () => {
        await getSwiftProject(async hostProject => {
            await hostProject.open()
            const diff = hostProject.hostFilesDiff

            expect(diff.filesToAdd).toStrictEqual([])

            expect(diff.filesToUpdate).toStrictEqual([])

            expect(diff.filesToDelete).toStrictEqual([
                {relativePath: 'BjsEnvironment.swift'}, {relativePath: 'FerrariCalifornia.swift'},
                {relativePath: 'TeslaRoadster.swift'}, {relativePath: 'libs/MotorVehicle.swift'},
                {relativePath: 'libs/Vehicle.swift'}, {relativePath: 'native/EngineWrapper.swift'},
            ])
        })
    })

    test('hostFilesDiff', async () => {
        await getSwiftProject(async hostProject => {
            await hostProject.open()
            await hostProject.setHostFileContent('libs/Vehicle.swift', 'new Vehicle')
            await hostProject.setHostFileContent('FerrariCalifornia.swift', 'new FerrariCalifornia')
            await hostProject.setHostFileContent('FerrariMaranello.swift', 'new FerrariMaranello')

            const diff = hostProject.hostFilesDiff

            expect(diff.filesToAdd).toStrictEqual([
                {relativePath: 'FerrariMaranello.swift', content: 'new FerrariMaranello'},
            ])

            expect(diff.filesToUpdate).toMatchObject([
                {relativePath: 'libs/Vehicle.swift', content: 'new Vehicle'},
                {relativePath: 'FerrariCalifornia.swift', content: 'new FerrariCalifornia'},
            ])
            expect(diff.filesToUpdate.map(f => f.oldFile.relativePath))
                .toStrictEqual(['libs/Vehicle.swift', 'FerrariCalifornia.swift'])

            expect(diff.filesToDelete).toStrictEqual([
                {relativePath: 'BjsEnvironment.swift'}, {relativePath: 'TeslaRoadster.swift'},
                {relativePath: 'libs/MotorVehicle.swift'}, {relativePath: 'native/EngineWrapper.swift'},
            ])
        })
    })

    test('packageFilesDiff, delete all', async () => {
        await getSwiftProject(async hostProject => {
            await hostProject.open()
            const diff = hostProject.packageFilesDiff

            expect(diff.filesToAdd).toStrictEqual([])

            expect(diff.filesToUpdate).toStrictEqual([])

            expect(diff.filesToDelete.map(file => file.relativePath).sort()).toStrictEqual([
                'BjsNativeObject.js', 'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js', 'package.json',
                'node_modules/module-c/ModuleC.js', 'node_modules/module-c/package.json',
                'node_modules/module-c/node_modules/module-b/ModuleB.js',
                'node_modules/module-c/node_modules/module-b/package.json',
                'node_modules/module-b/ModuleB.js', 'node_modules/module-b/package.json',
                'node_modules/module-a/ModuleA.js', 'node_modules/module-a/package.json',
                'native/Engine.js', 'native/fuelCosts.js',
                'libs/MotorVehicle.js', 'libs/Vehicle.js',
            ].sort())
        })
    })

    test('packageFilesDiff', async () => {
        await getSwiftProject(async hostProject => {
            await hostProject.open()
            await hostProject.setPackageFileContent('BjsNativeObject.js', 'new BjsNativeObject')
            await hostProject.setPackageFileContent('node_modules/module-b/ModuleB.js', 'new ModuleB')
            await hostProject.setPackageFileContent('FerrariMaranello.js', 'new FerrariMaranello')

            const diff = hostProject.packageFilesDiff

            expect(diff.filesToAdd).toStrictEqual([
                {relativePath: 'FerrariMaranello.js', content: 'new FerrariMaranello'},
            ])

            expect(diff.filesToUpdate).toMatchObject([
                {relativePath: 'BjsNativeObject.js', content: 'new BjsNativeObject'},
                {relativePath: 'node_modules/module-b/ModuleB.js', content: 'new ModuleB'},
            ])
            expect(diff.filesToUpdate.map(f => f.oldFile.relativePath))
                .toStrictEqual(['BjsNativeObject.js', 'node_modules/module-b/ModuleB.js'])

            expect(diff.filesToDelete.map(file => file.relativePath).sort()).toStrictEqual([
                'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js', 'package.json',
                'node_modules/module-c/ModuleC.js', 'node_modules/module-c/package.json',
                'node_modules/module-c/node_modules/module-b/ModuleB.js',
                'node_modules/module-c/node_modules/module-b/package.json', 'node_modules/module-b/package.json',
                'node_modules/module-a/ModuleA.js', 'node_modules/module-a/package.json',
                'native/Engine.js', 'native/fuelCosts.js',
                'libs/MotorVehicle.js', 'libs/Vehicle.js',
            ].sort())
        })
    })

    test('open', async () => {
        await getSwiftProject(async hostProject => {
            await hostProject.open()
            const oldHostFiles = [...hostProject.oldHostFiles]

            const expectedRelativePaths = [
                'BjsEnvironment.swift', 'FerrariCalifornia.swift', 'TeslaRoadster.swift', 'libs/MotorVehicle.swift',
                'libs/Vehicle.swift', 'native/EngineWrapper.swift',
            ]
            expect(oldHostFiles.map(keyValue => keyValue[0])).toStrictEqual(expectedRelativePaths)
            expect(oldHostFiles.map(keyValue => keyValue[1].relativePath)).toStrictEqual(expectedRelativePaths)
        })
    })

    test('setHostFileContent', async () => {
        const hostProject = new HostProject()
        await hostProject.setHostFileContent('dir3/path.swift', 'file content 1')
        await hostProject.setHostFileContent('dir4/path.swift', 'file content 2')

        expect([...hostProject.newHostFiles]).toStrictEqual([
            ['dir3/path.swift', 'file content 1'],
            ['dir4/path.swift', 'file content 2'],
        ])
    })

    test('setPackageFileContent', async () => {
        const hostProject = new HostProject()
        await hostProject.setPackageFileContent('dir3/path.js', 'file content 1')
        await hostProject.setPackageFileContent('dir4/path.js', 'file content 2')

        expect([...hostProject.newPackageFiles]).toStrictEqual([
            ['dir3/path.js', 'file content 1'],
            ['dir4/path.js', 'file content 2'],
        ])
    })

    test('isToUpdate, no old file', async () => {
        const hostProject = new HostProject()
        const oldFile = {
            exists: t.mockFn(async () => false),
        }
        expect(await hostProject.isToUpdate(oldFile, 'newContent')).toBe(true)
    })

    test('isToUpdate, old file with outdated content', async () => {
        const hostProject = new HostProject()
        const oldFile = {
            exists: t.mockFn(async () => true),
            getContent: t.mockFn(async () => 'oldContent'),
        }
        expect(await hostProject.isToUpdate(oldFile, 'newContent')).toBe(true)
    })

    test('isToUpdate, old file with updated content', async () => {
        const hostProject = new HostProject()
        const oldFile = {
            exists: t.mockFn(async () => true),
            getContent: t.mockFn(async () => 'newContent'),
        }
        expect(await hostProject.isToUpdate(oldFile, 'newContent')).toBe(false)
    })

    test('save', async () => {
        const targetProject = {
            removeHostFile: t.mockFn(),
            setHostFileContent: t.mockFn(),
            removePackageFile: t.mockFn(),
            setPackageFileContent: t.mockFn(),
            save: t.mockFn(),
        }

        const hostProject = new HostProject(targetProject, stats)
        t.mockGetter(hostProject, 'hostFilesDiff', () => ({
            filesToDelete: [{relativePath: 'hostFile/to/delete'}],
            filesToUpdate: [
                {relativePath: 'hostFile/to/update1', content: 'hostFile1Content', oldFile: 'oldHostFile1'},
                {relativePath: 'hostFile/to/update2', content: 'hostFile2Content', oldFile: 'oldHostFile2'},
            ],
            filesToAdd: [{relativePath: 'hostFile/to/add', content: 'hostFile3Content'}],
        }))
        t.mockGetter(hostProject, 'packageFilesDiff', () => ({
            filesToDelete: [{relativePath: 'packageFile/to/delete'}],
            filesToUpdate: [
                {relativePath: 'packageFile/to/update1', content: 'packageFile1Content', oldFile: 'oldPackageFile1'},
                {relativePath: 'packageFile/to/update2', content: 'packageFile2Content', oldFile: 'oldPackageFile2'},
            ],
            filesToAdd: [{relativePath: 'packageFile/to/add', content: 'packageFile3Content'}],
        }))

        hostProject.isToUpdate = t.mockFn()
            .mockReturnValueOnce(true).mockReturnValueOnce(false)
            .mockReturnValueOnce(true).mockReturnValueOnce(false)

        await hostProject.save()

        expect(targetProject.removeHostFile).toHaveBeenCalledTimes(2)
        expect(targetProject.removeHostFile).toHaveBeenNthCalledWith(1, 'hostFile/to/delete')
        expect(targetProject.removeHostFile).toHaveBeenNthCalledWith(2, 'hostFile/to/update1')

        expect(targetProject.setHostFileContent).toHaveBeenCalledTimes(2)
        expect(targetProject.setHostFileContent).toHaveBeenNthCalledWith(1, 'hostFile/to/update1', 'hostFile1Content')
        expect(targetProject.setHostFileContent).toHaveBeenNthCalledWith(2, 'hostFile/to/add', 'hostFile3Content')

        expect(targetProject.removePackageFile).toHaveBeenCalledTimes(2)
        expect(targetProject.removePackageFile).toHaveBeenNthCalledWith(1, 'packageFile/to/delete')
        expect(targetProject.removePackageFile).toHaveBeenNthCalledWith(2, 'packageFile/to/update1')

        expect(targetProject.setPackageFileContent).toHaveBeenCalledTimes(2)
        expect(targetProject.setPackageFileContent).toHaveBeenNthCalledWith(1, 'packageFile/to/update1', 'packageFile1Content')
        expect(targetProject.setPackageFileContent).toHaveBeenNthCalledWith(2, 'packageFile/to/add', 'packageFile3Content')

        expect(targetProject.save).toHaveBeenCalled()
        expect(hostProject.isToUpdate).toBeCalledWith('oldHostFile1', 'hostFile1Content')
        expect(hostProject.isToUpdate).toBeCalledWith('oldHostFile2', 'hostFile2Content')
        expect(hostProject.isToUpdate).toBeCalledWith('oldPackageFile1', 'packageFile1Content')
        expect(hostProject.isToUpdate).toBeCalledWith('oldPackageFile2', 'packageFile2Content')
    })
})