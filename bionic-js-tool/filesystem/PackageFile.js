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

    async generate(hostProject) {
        let guestFileContent
        try {
            guestFileContent = await this.guestFile.getContent()
        } catch (error) {
            error.message = `reading guest code file "${this.guestFile.relativePath}"\n${error.message}`
            throw error
        }

        const packageFileContent = guestFileContent

        await hostProject.setPackageFileContent(this.relativePath, packageFileContent)
    }
}

module.exports = {PackageFile}