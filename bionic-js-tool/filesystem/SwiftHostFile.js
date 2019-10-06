const {HostFile} = require('./HostFile')
const {SwiftHostClassGenerator} = require('../generation/swift/SwiftHostClassGenerator')
const {SwiftWrapperClassGenerator} = require('../generation/swift/SwiftWrapperClassGenerator')

class SwiftHostFile extends HostFile {

    static build(guestFile, config) {
        const isNativeWrapper = guestFile.isInsideDir(config.guestNativeDir)
        const newFileName = `${guestFile.name}${isNativeWrapper ? 'Wrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(config.hostDir, newFileName, '.swift'), config.hostDir,
            guestFile, isNativeWrapper)
    }

    async generate(schema, hostProject) {
        const hostFileGenerator = this.isNativeWrapper ? new SwiftWrapperClassGenerator(schema) :
            new SwiftHostClassGenerator(schema)

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating host code from guest file "${this.guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setHostFileContent(this, hostFileContent)
    }
}

module.exports = {SwiftHostFile}