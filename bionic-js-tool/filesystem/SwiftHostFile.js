const {HostFile} = require('./HostFile')
const {SwiftHostClassGenerator} = require('../generation/swift/SwiftHostClassGenerator')
const {SwiftWrapperClassGenerator} = require('../generation/swift/SwiftWrapperClassGenerator')

class SwiftHostFile extends HostFile {

    static build(guestFile, targetConfig) {
        const newFileName = `${guestFile.name}${guestFile.isNative ? 'Wrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(targetConfig.hostDirPath, newFileName, '.swift'),
            targetConfig.hostDirPath, guestFile)
    }

    async generate(schema, hostProject) {
        const hostFileGenerator = this.guestFile.isNative ? new SwiftWrapperClassGenerator(schema) :
            new SwiftHostClassGenerator(schema)

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating host code from guest file "${this.guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setHostFileContent(this.relativePath, hostFileContent)
    }
}

module.exports = {SwiftHostFile}