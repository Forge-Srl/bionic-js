const {HostFile} = require('./HostFile')

class SwiftHostFile extends HostFile {

    static build(guestFile, hostDirPath) {
        return new SwiftHostFile(guestFile.composeNewPath(hostDirPath, '.swift'))
    }

    async generate() {
        await this.dir.ensureExists()

        const hostFileContent = `/* Swift file for ${this.path}... */`

        try {
            await this.setContent(hostFileContent)
        } catch (error) {
            throw new Error(`Error writing host file "${this.path}"\n${error.stack}`)
        }
    }
}

module.exports = {SwiftHostFile}