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
            error.message = `reading guest code file "${this.guestFile.path}"\n${error.message}`
            throw error
        }

        const packageFileContent = guestFileContent

        try {
            await this.setContent(packageFileContent)
        } catch (error) {
            error.message = `writing package file "${this.path}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {PackageFile}