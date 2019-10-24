const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    guestDirPath: localPath('guest'),
    guestIgnores: ['/tests'],
    hostTargets: [{
        hostLanguage: 'swift',
        xcodeProjectPath: null, // temp dir
        hostDirName: 'HostProject/host',
        packageName: 'package.bundle',
        compileTargets: ['HostProject', 'HostProjectTarget2'],
    }],
}