const {HostFile} = require('./HostFile')
const {SwiftHostClassGenerator} = require('../generation/swift/SwiftHostClassGenerator')

class SwiftHostFile extends HostFile {

    static build(guestFile, hostDirPath) {
        return new SwiftHostFile(guestFile.composeNewPath(hostDirPath, '.swift'), hostDirPath, guestFile)
    }

    async generate(schema) {
        await this.dir.ensureExists()

        const hostFileContent = new SwiftHostClassGenerator(schema).getSource()

        try {
            return await this.setContent(hostFileContent)
        } catch (error) {
            throw new Error(`writing host file "${this.guestFile.relativePath}"\n${error.stack}`)
        }
    }
}

module.exports = {SwiftHostFile}