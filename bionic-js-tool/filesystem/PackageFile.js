const {File} = require('./File')
const {Directory} = require('./Directory')
const Terser = require('terser')
const terserOptions = {safari10: true}

class PackageFile extends File {

    constructor(path, packageDirPath, exportedFile, minimization) {
        super(path, packageDirPath)
        Object.assign(this, {exportedFile, minimization})
    }

    static build(exportedFile, targetConfig) {
        const packageDirPath = new Directory(targetConfig.hostDirPath).getSubDir(targetConfig.packageName).path
        const packageFilePath = exportedFile.guestFile.composeNewPath(packageDirPath)
        return new PackageFile(packageFilePath, packageDirPath, exportedFile, targetConfig.packageMinimization)
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

        let packageFileContent = guestFileContent

        try {
            if (this.minimization && guestFile.isJavascript) {
                const result = Terser.minify(guestFileContent, terserOptions)
                if (result.error)
                    throw result.error
                packageFileContent = result.code
            }
        } catch (error) {
            error.message = `minimizing guest code file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }

        await hostProject.setPackageFileContent(this.relativePath, packageFileContent)
    }
}

module.exports = {PackageFile}