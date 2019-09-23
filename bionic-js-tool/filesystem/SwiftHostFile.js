const {HostFile} = require('./HostFile')
const {SwiftHostClassGenerator} = require('../generation/swift/SwiftHostClassGenerator')
const {SwiftWrapperClassGenerator} = require('../generation/swift/SwiftWrapperClassGenerator')

class SwiftHostFile extends HostFile {

    static build(guestFile, hostDirPath, guestNativeDirPath) {
        return new SwiftHostFile(guestFile.composeNewPath(hostDirPath, '.swift'), hostDirPath, guestNativeDirPath, guestFile)
    }

    async generate(schema) {
        await this.dir.ensureExists()

        const hostFileGenerator = this.guestFile.isInsideDir(this.guestNativeDirPath) ?
            new SwiftWrapperClassGenerator(schema) : new SwiftHostClassGenerator(schema)

        let hostFileContent
        try {
            hostFileContent = hostFileGenerator.getSource()
        } catch (error) {
            error.message = `generating code in host file "${this.relativePath}"\n${error.message}`
            throw error
        }

        try {
            return await this.setContent(hostFileContent)
        } catch (error) {
            error.message = `writing host file "${this.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {SwiftHostFile}