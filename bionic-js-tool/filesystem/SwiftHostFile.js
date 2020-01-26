const {HostFile} = require('./HostFile')

class SwiftHostFile extends HostFile {

    static build(exportedFile, targetConfig) {
        const guestFile = exportedFile.guestFile
        const newFileName = `${guestFile.name}${guestFile.isNative ? 'Wrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(targetConfig.hostDirPath, newFileName, '.swift'),
            targetConfig.hostDirPath, exportedFile)
    }

    async generate(hostProject) {
        const guestFile = this.exportedFile.guestFile
        const schema = this.exportedFile.schema

        const hostClassGenerator = schema.generator.swift.forHosting()
        const hostFileGenerator = guestFile.isNative ? schema.generator.swift.forWrapping(hostClassGenerator) : hostClassGenerator

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating host code from guest file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setHostFileContent(this.relativePath, hostFileContent)
    }
}

module.exports = {SwiftHostFile}