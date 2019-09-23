const t = require('../test-utils')
const path = require('path')

describe('GuestWatcher', () => {

    let watcher

    beforeEach(() => {
        const GuestWatcher = t.requireModule('filesystem/GuestWatcher').GuestWatcher
        const guestDir = path.resolve(__dirname, '../../testing-code/guest')
        const config = {guestDir, guestIgnores: ['node_modules']}

        watcher = GuestWatcher.build(config)
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
        const dependenciesFiles = await watcher.getDependenciesFiles()
        const dependenciesPaths = dependenciesFiles.map(guestFile => guestFile.relativePath)

        expect(dependenciesPaths.length).toEqual(expectedDependencies.length)
        expect(dependenciesPaths).toEqual(expect.arrayContaining(expectedDependencies))
    })

    const expectedGuestFiles = [
        ...expectedDependencies,
        'package.json', 'FerrariCalifornia.js', 'GannaBicycle.js', 'TeslaRoadster.js', 'libs/MotorVehicle.js',
        'libs/Vehicle.js', 'native/Engine.js', 'native/fuelCosts.js', 'tests/guest1-test.js',
    ]

    test('getInitialFiles', async () => {
        const guestFiles = await watcher.getInitialFiles()
        const guestPaths = guestFiles.map(guestFile => guestFile.relativePath)

        expect(guestPaths.length).toEqual(expectedGuestFiles.length)
        expect(guestPaths).toEqual(expect.arrayContaining(expectedGuestFiles))
    })
})