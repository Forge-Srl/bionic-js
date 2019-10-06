const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    guestDir: localPath('guest'),
    guestIgnores: ['/tests'],
    guestNativeDir: localPath('guest/native'),
    hostTargets: {
        hostLanguage: 'swift',
        hostDir: localPath('host'),
        packageDir: localPath('host/package'),
        xcodeProjectPath: localPath('host/HostProject.xcodeproj'),
    },
}
