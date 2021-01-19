const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    projectName: 'BeautifulVehicles',
    guestDirPath: localPath('guest'),
    guestBundles: {
        MotorVehicles: {
            entryPaths: ['./FerrariCalifornia', './TeslaRoadster'],
        },
        Vehicles: {
            entryPaths: ['./Bicycle'],
        },
    },
    outputMode: 'development',
    hostProjects: [{
        language: 'swift',
        projectPath: null, // property set by tests
        hostDirName: 'HostProject/host',
        targetBundles: {
            MotorVehicles: {
                compileTargets: ['MotorVehiclesTarget'],
            },
            Vehicles: {
                compileTargets: ['VehiclesTarget', 'BicycleTarget'],
            },
        },
    }, {
        language: 'java',
        projectPath: null, // property set by tests
        srcDirName: 'HostProject/src',
        basePackage: 'test.project',
        hostPackage: 'host',
        nativePackage: '$native$',
        targetBundles: {
            MotorVehicles: {
                sourceSets: ['motor-vehicles'],
            },
            Vehicles: {
                sourceSets: ['vehicles', 'bicycle'],
            },
        }
    }],
}