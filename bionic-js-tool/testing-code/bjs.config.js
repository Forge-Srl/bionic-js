const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    guestDirPath: localPath('guest'),
    guestIgnores: ['/tests'],
    hostTargets: {
        hostLanguage: 'swift',
        xcodeProjectPath: localPath('host/swift/HostProject.xcodeproj'),
        packageName: 'package',
        hostDirName: 'HostProject/host',
    },
}