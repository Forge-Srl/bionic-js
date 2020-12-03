const path = require('path')

module.exports = {
    projectName: "HelloWorld",
    guestDirPath: path.resolve(__dirname, "./js"),
    guestBundles: {
        BusinessLogic: { 
            entryPaths: ['./HelloWorld'],
        },
    },
    outputMode: "development",
    hostProjects: [{
        language: "swift",
        projectPath: "./swift/HelloWorld.xcodeproj",
        hostDirName: "Bjs",
        targetBundles: {
            BusinessLogic: {
                compileTargets: ["HelloWorld"],
            },
        },
    }],
}