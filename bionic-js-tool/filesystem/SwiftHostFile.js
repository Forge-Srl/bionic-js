const {HostFile} = require('./HostFile')
const {SWIFT_FILE_EXT} = require('./fileExtensions')

class SwiftHostFile extends HostFile {

    static build(exportedFile, targetConfig) {
        const guestFile = exportedFile.guestFile
        const newFileName = `${guestFile.name}${exportedFile.schema.isNative ? 'Wrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(targetConfig.hostDirPath, newFileName, SWIFT_FILE_EXT),
            targetConfig.hostDirPath, exportedFile)
    }

    async generate(hostProject) {
        const schema = this.exportedFile.schema
        const schemaGenerator = schema.generator
        const hostClassGenerator = schemaGenerator.forHosting().swift

        const hostFileGenerator = schema.isNative
            ? schemaGenerator.forWrapping(hostClassGenerator).swift
            : hostClassGenerator

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating host code from guest file "${this.exportedFile.guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setHostFileContent(this.relativePath, hostFileContent)
    }
}

module.exports = {SwiftHostFile}