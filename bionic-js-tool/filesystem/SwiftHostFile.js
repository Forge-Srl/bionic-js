const {HostFile} = require('./HostFile')

class SwiftHostFile extends HostFile {

    static build(guestFile, targetConfig) {
        const newFileName = `${guestFile.name}${guestFile.isNative ? 'Wrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(targetConfig.hostDirPath, newFileName, '.swift'),
            targetConfig.hostDirPath, guestFile)
    }

    async generate(schema, hostProject) {

        const hostClassGenerator = schema.generator.swift.forHosting()
        const hostFileGenerator = this.guestFile.isNative ?
            schema.generator.swift.forWrapping(hostClassGenerator) :
            hostClassGenerator

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