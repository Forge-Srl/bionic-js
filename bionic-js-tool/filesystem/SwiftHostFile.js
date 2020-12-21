const {HostFile} = require('./HostFile')
const {SWIFT_FILE_EXT} = require('./fileExtensions')

class SwiftHostFile extends HostFile {

    static build(annotatedFile, hostProjectConfig, projectName) {
        const guestFile = annotatedFile.guestFile
        const newFileName = `${guestFile.name}${annotatedFile.schema.isNative ? 'BjsWrapper' : ''}`
        return new SwiftHostFile(guestFile.composeNewPath(hostProjectConfig.hostDir.path, newFileName, SWIFT_FILE_EXT),
            hostProjectConfig.hostDir.path, annotatedFile, projectName)
    }

    async generate(hostProject, allFiles) {
        const guestFile = this.annotatedFile.guestFile
        const schema = this.annotatedFile.schema

        const schemaGenerator = schema.generator
        const hostClassGenerator = schemaGenerator.forHosting(this.projectName).swift

        const hostFileGenerator = schema.isNative
            ? schemaGenerator.forWrapping(hostClassGenerator, this.projectName).swift
            : hostClassGenerator

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating host code from guest file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setHostFileContent(this.relativePath, guestFile.bundles, hostFileContent)
    }
}

module.exports = {SwiftHostFile}