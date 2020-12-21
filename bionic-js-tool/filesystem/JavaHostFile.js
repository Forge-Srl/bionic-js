const {HostFile} = require('./HostFile')
const {JAVA_FILE_EXT} = require('./fileExtensions')
const {JavaUtils} = require('../generation/java/JavaUtils')

class JavaHostFile extends HostFile {

    static build(annotatedFile, hostProjectConfig, projectName) {
        const guestFile = annotatedFile.guestFile
        const newFileName = `${guestFile.name}${annotatedFile.schema.isNative ? 'BjsExport' : ''}`
        const newPath = JavaUtils.pathToSafePath(guestFile.composeNewPath(hostProjectConfig.hostDir.path, newFileName, JAVA_FILE_EXT))
        return new JavaHostFile(newPath,
            hostProjectConfig.hostDir.path, annotatedFile, projectName, hostProjectConfig.hostPackage)
    }

    constructor(path, hostDir, annotatedFile, projectName, basePackage) {
        super(path, hostDir, annotatedFile, projectName)
        Object.assign(this, {basePackage})
    }

    async generate(hostProject, allFiles) {
        const guestFile = this.annotatedFile.guestFile
        const schema = this.annotatedFile.schema

        const schemaGenerator = schema.generator
        const hostClassGenerator = schemaGenerator.forHosting(this.projectName, this.basePackage, allFiles).java

        const hostFileGenerator = schema.isNative
            ? schemaGenerator.forWrapping(hostClassGenerator, this.projectName, this.basePackage, allFiles).java
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

module.exports = {JavaHostFile}