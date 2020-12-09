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
        projectPath: "./swift/HelloJsWorld.xcodeproj",
        hostDirName: "Bjs",
        targetBundles: {
            MainBundle: {
                compileTargets: ["HelloJsWorld"],
            },
        },
    }],
}