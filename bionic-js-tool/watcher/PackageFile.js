const {File} = require('./File')

class PackageFile extends File {

    constructor(path, packageDirPath, guestFile) {
        super(path, packageDirPath)
        this.guestFile = guestFile
    }

    static build(guestFile, packageDirPath) {
        const packageFilePath = guestFile.composeNewPath(packageDirPath)
        return new PackageFile(packageFilePath, packageDirPath, guestFile)
    }

    async generate() {
        await this.dir.ensureExists()

        let guestFileContent
        try {
            guestFileContent = await this.guestFile.getContent()
        } catch (error) {
            throw new Error(`Error reading guest code file "${this.guestFile.path}"\n${error.stack}`)
        }

        const packageFileContent = guestFileContent

        try {
            await this.setContent(packageFileContent)
        } catch (error) {
            throw new Error(`Error writing package file "${this.path}"\n${error.stack}`)
        }
    }
}

module.exports = {PackageFile}