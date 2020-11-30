const {HostEnvironmentFile} = require('./HostEnvironmentFile')
const {SwiftHostEnvironmentFileGenerator} = require('../generation/swift/SwiftHostEnvironmentFileGenerator')

class SwiftHostEnvironmentFile extends HostEnvironmentFile {

    static build(nativeFiles, bundleName, hostProjectConfig, projectName) {
        const filePath = hostProjectConfig.hostDir.getSubDir(`Bjs${bundleName}`).getSubFile(`Bjs${projectName}.swift`).path
        return new SwiftHostEnvironmentFile(filePath, hostProjectConfig.hostDir.path, bundleName, nativeFiles, projectName)
    }

    async generate(hostProject) {
        const generator = new SwiftHostEnvironmentFileGenerator(this.bundleName, this.nativeFiles, this.projectName)
        await hostProject.setHostFileContent(this.relativePath, [this.bundleName], generator.getSource())
    }
}

module.exports = {SwiftHostEnvironmentFile}