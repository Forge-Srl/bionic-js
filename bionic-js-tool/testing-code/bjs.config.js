const path = require('path')

const localPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
    guestDir: localPath('guest'),
    guestIgnores: ['/tests'],
    packageDir: localPath('host/package'),
    hostDir: localPath('host'),
    hostLanguage: 'swift'
}