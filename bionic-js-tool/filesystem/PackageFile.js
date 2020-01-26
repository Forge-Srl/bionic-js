const {File} = require('./File')

class PackageFile extends File {

    constructor(path, packageDirPath, exportedFile) {
        super(path, packageDirPath)
        Object.assign(this, {exportedFile})
    }

    static build(exportedFile, packageDirPath) {
        const packageFilePath = exportedFile.guestFile.composeNewPath(packageDirPath)
        return new PackageFile(packageFilePath, packageDirPath, exportedFile)
    }

    async generate(hostProject) {
        const guestFile = this.exportedFile.guestFile
        let guestFileContent
        try {
            guestFileContent = await guestFile.getContent()
        } catch (error) {
            error.message = `reading guest code file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }

        const packageFileContent = guestFileContent

        await hostProject.setPackageFileContent(this.relativePath, packageFileContent)
    }
}

module.exports = {PackageFile}