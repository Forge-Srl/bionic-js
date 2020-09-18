const t = require('../test-utils')
const path = require('path')

describe('GuestWalker', () => {

    let guestDirPath, guestNativeDirPath, GuestFile, walker

    beforeEach(() => {
        const GuestWalker = t.requireModule('filesystem/GuestWalker').GuestWalker
        guestDirPath = path.resolve(__dirname, '../../testing-code/guest')
        guestNativeDirPath = path.resolve(__dirname, '../../testing-code/guest/native')
        const config = {guestDirPath, guestNativeDirPath, guestIgnores: ['node_modules']}

        GuestFile = t.requireModule('filesystem/GuestFile').GuestFile
        walker = GuestWalker.build(config)
    })

    const expectedDependencies = [
        'node_modules/module-a/ModuleA.js',
        'node_modules/module-a/package.json',
        'node_modules/module-b/ModuleB.js',
        'node_modules/module-b/package.json',
        'node_modules/module-c/ModuleC.js',
        'node_modules/module-c/package.json',
        'node_modules/module-c/node_modules/module-b/ModuleB.js',
        'node_modules/module-c/node_modules/module-b/package.json',
    ]

    test('getDependenciesFiles', async () => {
        const dependenciesFiles = await walker.getDependenciesFiles()
        dependenciesFiles.forEach(dependencyFile => {
            expect(dependencyFile).toBeInstanceOf(GuestFile)
            expect(dependencyFile.rootDirPath).toBe(guestDirPath)
            expect(dependencyFile.guestNativeDirPath).toBe(guestNativeDirPath)
        })
        const dependenciesPaths = dependenciesFiles.map(guestFile => guestFile.relativePath)

        expect(dependenciesPaths.length).toEqual(expectedDependencies.length)
        expect(dependenciesPaths).toEqual(expect.arrayContaining(expectedDependencies))
    })

    const expectedGuestFiles = [
        ...expectedDependencies,
        'package.json', 'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js', 'libs/MotorVehicle.js',
        'libs/Vehicle.js', 'native/Engine.js', 'native/fuelCosts.js', 'tests/guest1-test.js',
    ]

    test('getFiles', async () => {

        const guestFiles = await walker.getFiles()
        guestFiles.forEach(guestFile => {
            expect(guestFile).toBeInstanceOf(GuestFile)
            expect(guestFile.rootDirPath).toBe(guestDirPath)
            expect(guestFile.guestNativeDirPath).toBe(guestNativeDirPath)
        })
        const guestPaths = guestFiles.map(guestFile => guestFile.relativePath)

        expect(guestPaths.length).toEqual(expectedGuestFiles.length)
        expect(guestPaths).toEqual(expect.arrayContaining(expectedGuestFiles))
    })

    test('getFiles, duplicated guest files', async () => {

        const guestFile1 = new GuestFile('/path1')
        const guestFile2 = new GuestFile('/path2')
        const guestFile3 = new GuestFile('/path3')

        const FileWalker = t.requireModule('filesystem/FileWalker').FileWalker
        FileWalker.prototype.getFiles = async () => [guestFile1, guestFile2]
        const GuestWalker = t.requireModule('filesystem/GuestWalker').GuestWalker
        t.resetModulesCache()

        walker = GuestWalker.build({})
        walker.getDependenciesFiles = async () => [guestFile2, guestFile3]

        const guestFiles = await walker.getFiles()
        expect(guestFiles.length).toBe(3)
        expect(guestFiles).toEqual(expect.arrayContaining([guestFile1, guestFile2, guestFile3]))
    })
})