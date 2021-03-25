const path = require('path')
const resolve = p => path.resolve(__dirname, p)

module.exports = {
    projectName: 'SimpleProject',
    guestDirPath: resolve('./guest/path'),
    guestBundles: {
        SimpleCore: {
            entryPaths: ['./SimpleEntryPoint'],
        },
    },
    outputMode: 'production',
    hostProjects: [{
        language: 'swift',
        projectPath: resolve('./ios/SimpleProject.xcodeproj'),
        hostDirName: 'SimpleHostProject/host',
        targetBundles: {
            SimpleCore: {
                compileTargets: ['SimpleCoreTarget'],
            },
        },
    }, {
        language: 'java',
        projectPath: resolve('./java/SimpleProject'),
        srcDirName: 'src',
        basePackage: 'com.simple.project',
        hostPackage: 'host',
        nativePackage: 'nativeComponents',
        targetBundles: {
            SimpleCore: {
                sourceSets: ['simplecore'],
            },
        },
    }],
}