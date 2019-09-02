const {HostFile} = require('./HostFile')

class SwiftHostFile extends HostFile {

    static build(guestFile, hostDirPath) {
        return new SwiftHostFile(guestFile.composeNewPath(hostDirPath, '.swift'), hostDirPath, guestFile)
    }

    async generate() {
        await this.dir.ensureExists()

        const hostFileContent = `/* Swift file for ${this.guestFile.relativePath}... */`

        try {
            await this.setContent(hostFileContent)
        } catch (error) {
            throw new Error(`Error writing host file "${this.guestFile.relativePath}"\n${error.stack}`)
        }
    }
}

module.exports = {SwiftHostFile}