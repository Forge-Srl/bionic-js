const path = require('path')

module.exports = {
    projectName: "HelloJsWorld",
    guestDirPath: path.resolve(__dirname, "./js"),
    guestBundles: {
        MainBundle: { 
            entryPaths: ['./HelloWorld'],
        },
    },
    outputMode: "development",
    hostProjects: [{
        language: "swift",
        projectPath: path.resolve(__dirname, "./swift/HelloJsWorld.xcodeproj"),
        hostDirName: "Bjs",
        targetBundles: {
            MainBundle: {
                compileTargets: ["HelloJsWorld (iOS)", "HelloJsWorld (macOS)"],
            },
        },
    }, {
        language: "java",
        projectPath: path.resolve(__dirname, "./java"),
        srcDirName: "src",
        basePackage: "example.helloWorld",
        hostPackage: "js",
        targetBundles: {
            MainBundle: {
                sourceSets: ["example"],
            }
        }
    }],
}