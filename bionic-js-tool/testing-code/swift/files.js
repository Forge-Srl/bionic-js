const hostFilePaths = ['FerrariCalifornia.swift', 'TeslaRoadster.swift', 'libs/MotorVehicle.swift',
    'libs/Vehicle.swift', 'native/EngineWrapper.swift']

const packageFilePaths = ['FerrariCalifornia.js', 'GannaBicycle.js', 'package.json', 'TeslaRoadster.js',
    'libs/MotorVehicle.js', 'libs/Vehicle.js',
    'native/Engine.js', 'native/fuelCosts.js',
    'node_modules/module-a/ModuleA.js', 'node_modules/module-a/package.json',
    'node_modules/module-b/ModuleB.js', 'node_modules/module-b/package.json',
    'node_modules/module-c/ModuleC.js', 'node_modules/module-c/package.json',
    'node_modules/module-c/node_modules/module-b/ModuleB.js', 'node_modules/module-c/node_modules/module-b/package.json',
]

const forbiddenPackageFilePaths = ['dependencies.txt', 'license.txt',
    'node_modules/module-a/node_modules/module-c/ModuleC.js', 'node_modules/module-a/node_modules/module-c/package.json',
    'node_modules/module-c/node_modules/module-d/ModuleD.js', 'node_modules/module-c/node_modules/module-d/package.json',
    'tests/guest1-test.js',
]

module.exports = {hostFilePaths, packageFilePaths, forbiddenPackageFilePaths}