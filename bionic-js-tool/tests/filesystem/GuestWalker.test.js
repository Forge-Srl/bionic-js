const t = require('../test-utils')
const path = require('path')

describe('GuestWalker', () => {

    let GuestWalker, guestDirPath, GuestFile, BjsConfiguration

    beforeEach(() => {
        GuestWalker = t.requireModule('filesystem/GuestWalker').GuestWalker
        guestDirPath = path.resolve(__dirname, '../../testing-code/guest')
        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
    })

    function getWalker(guestBundles) {
        const config = new BjsConfiguration({guestDirPath, guestBundles}, 'configuration')
        return GuestWalker.build(config)
    }

    function expectGuestFiles(actualGuestFiles, expectedRelativePaths, expectedBundles) {
        actualGuestFiles.forEach(guestFile => {
            expect(guestFile).toBeInstanceOf(GuestFile)
            expect(guestFile.rootDirPath).toBe(guestDirPath)
        })

        const actualRelativePaths = actualGuestFiles.map(guestFile => guestFile.relativePath).sort()
        expect(actualRelativePaths).toEqual(expectedRelativePaths)

        const actualBundles = actualRelativePaths
            .map(relativePath => actualGuestFiles.find(guestFile => guestFile.relativePath === relativePath).bundles.sort())
        expect(actualBundles).toEqual(expectedBundles)
    }

    test('getFiles, single entry point with dependencies', async () => {
        const walker = getWalker({bundle1: {entryPaths: ['./FerrariCalifornia.js']}})
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['FerrariCalifornia.js', 'libs/FuelType.js',
                'libs/MotorVehicle.js', 'libs/Vehicle.js',
                'native/BaseEngine.js', 'native/Engine.js',
                'node_modules/module-a/ModuleA.js', 'node_modules/module-b/ModuleB.js',
                'node_modules/module-c/ModuleC.js', 'node_modules/module-c/node_modules/module-b/ModuleB.js'],

            [['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1']])
    })

    test('getFiles, single entry point with 2 dependencies', async () => {
        const walker = getWalker({bundle1: {entryPaths: ['./GannaBicycle.js']}})
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['Bicycle.js', 'GannaBicycle.js',
                'libs/Vehicle.js'],

            [['bundle1'], ['bundle1'],
                ['bundle1']])
    })

    test('getFiles, 2 entry points', async () => {
        const walker = getWalker({bundle1: {entryPaths: ['./Bicycle.js', './native/Engine.js']}})
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['Bicycle.js', 'libs/FuelType.js',
                'libs/Vehicle.js', 'native/BaseEngine.js',
                'native/Engine.js'],

            [['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1']])
    })

    test('getFiles, 3 entry points', async () => {
        const walker = getWalker({bundle1: {entryPaths: ['./FerrariCalifornia.js', './GannaBicycle.js', './TeslaRoadster.js']}})
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['Bicycle.js', 'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js',
                'libs/FuelType.js', 'libs/MotorVehicle.js', 'libs/Vehicle.js',
                'native/BaseEngine.js', 'native/Engine.js', 'node_modules/module-a/ModuleA.js',
                'node_modules/module-b/ModuleB.js', 'node_modules/module-c/ModuleC.js',
                'node_modules/module-c/node_modules/module-b/ModuleB.js',
            ],

            [['bundle1'], ['bundle1'], ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1']])
    })

    test('getFiles, ignore export', async () => {
        const walker = getWalker({bundle1: {entryPaths: ['./TeslaRoadster.js'], ignoreExport: ['node_modules']}})
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['TeslaRoadster.js', 'libs/FuelType.js', 'libs/MotorVehicle.js', 'libs/Vehicle.js',
                'native/BaseEngine.js', 'native/Engine.js'],

            [['bundle1'], ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1'], ['bundle1']])
    })

    test('getFiles, multiple ignore export', async () => {
        const walker = getWalker({
            bundle1: {
                entryPaths: ['./TeslaRoadster.js'],
                ignoreExport: ['node_modules', 'libs/V*'],
            },
        })
        const guestFiles = await walker.getFiles()

        expectGuestFiles(guestFiles,
            ['TeslaRoadster.js',
                'libs/FuelType.js', 'libs/MotorVehicle.js',
                'native/BaseEngine.js', 'native/Engine.js'],

            [['bundle1'],
                ['bundle1'], ['bundle1'],
                ['bundle1'], ['bundle1']])
    })

    test('getFiles, multiple bundles, multiple ignore export', async () => {
        const walker = getWalker({
            bundle1: {
                entryPaths: ['./TeslaRoadster.js'],
                ignoreExport: ['node_modules'],
            },
            bundle2: {
                entryPaths: ['./FerrariCalifornia.js', './GannaBicycle.js', './TeslaRoadster.js'],
                ignoreExport: ['node_modules', 'libs/V*'],
            },
            bundle3: {
                entryPaths: ['./FerrariCalifornia.js', './GannaBicycle.js'],
            },
        })
        const guestFiles = await walker.getFiles()


        expectGuestFiles(guestFiles,
            ['Bicycle.js', 'FerrariCalifornia.js',
                'GannaBicycle.js', 'TeslaRoadster.js',
                'libs/FuelType.js', 'libs/MotorVehicle.js', 'libs/Vehicle.js',
                'native/BaseEngine.js', 'native/Engine.js',
                'node_modules/module-a/ModuleA.js',
                'node_modules/module-b/ModuleB.js', 'node_modules/module-c/ModuleC.js',
                'node_modules/module-c/node_modules/module-b/ModuleB.js'],

            [['bundle2', 'bundle3'], ['bundle2', 'bundle3'],
                ['bundle2', 'bundle3'], ['bundle1', 'bundle2'],
                ['bundle1', 'bundle2', 'bundle3'], ['bundle1', 'bundle2', 'bundle3'], ['bundle1', 'bundle3'],
                ['bundle1', 'bundle2', 'bundle3'], ['bundle1', 'bundle2', 'bundle3'],
                ['bundle3'],
                ['bundle3'], ['bundle3'],
                ['bundle3'],
            ],
        )
    })
})