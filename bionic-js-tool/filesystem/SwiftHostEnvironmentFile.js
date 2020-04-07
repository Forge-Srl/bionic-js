const {HostEnvironmentFile} = require('./HostEnvironmentFile')
const path = require('path')
const {SwiftHostEnvironmentFileGenerator} = require('../generation/swift/SwiftHostEnvironmentFileGenerator')

class SwiftHostEnvironmentFile extends HostEnvironmentFile {

    static build(nativePackageFiles, targetConfig) {
        const filePath = path.resolve(targetConfig.hostDirPath, 'BjsEnvironment.swift')
        const packageFileNameWoExt = path.parse(targetConfig.packageName).name
        return new SwiftHostEnvironmentFile(filePath, targetConfig.hostDirPath, packageFileNameWoExt, nativePackageFiles)
    }

    async generate(hostProject) {
        const generator = new SwiftHostEnvironmentFileGenerator(this.packageName, this.nativePackageFiles)
        await hostProject.setHostFileContent(this.relativePath, generator.getSource())
    }
}

module.exports = {SwiftHostEnvironmentFile}