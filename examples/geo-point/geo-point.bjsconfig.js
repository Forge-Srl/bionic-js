const path = require('path')

module.exports = {
    projectName: "GeoPoint",
    guestDirPath: path.resolve(__dirname, "./js"),
    guestBundles: {
        BusinessLogic: { 
            entryPaths: ['./GeoPoint'],
        },
    },
    outputMode: "development",
    hostProjects: [{
        language: "swift",
        projectPath: "./swift/GeoPoint.xcodeproj",
        hostDirName: "BusinessLogic",
        targetBundles: {
            BusinessLogic: {
                compileTargets: ["\"GeoPoint (iOS)\""],
            },
        },
    }],
}