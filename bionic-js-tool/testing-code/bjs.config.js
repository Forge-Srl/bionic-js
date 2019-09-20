const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    guestDir: localPath('guest'),
    guestIgnores: ['/tests'],
    guestNativeDir: localPath('guest/native'),
    packageDir: localPath('host/package'),
    hostDir: localPath('host'),
    hostLanguage: 'swift'
}