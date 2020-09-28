const {File} = require('./File')
const Terser = require('terser')
const terserOptions = {safari10: true}

class PackageFile extends File {

    static build(exportedFile, targetConfig) {
        const {StandardPackageFile} = require('./StandardPackageFile')
        const {NativePackageFile} = require('./NativePackageFile')
        const packageFilePath = exportedFile.guestFile.composeNewPath(targetConfig.packageDirPath)
        const PackageFileClass = exportedFile.exportsNativeClass ? NativePackageFile : StandardPackageFile
        return new PackageFileClass(packageFilePath, targetConfig.packageDirPath, exportedFile, targetConfig.packageMinimization)
    }

    constructor(path, packageDirPath, exportedFile, minimization) {
        super(path, packageDirPath)
        Object.assign(this, {exportedFile, minimization})
    }

    async getPackageContent() {
        throw new Error('method "getPackageContent" must be implemented')
    }

    processPackage(packageFileContent) {
        const guestFile = this.exportedFile.guestFile
        try {
            if (this.minimization && guestFile.isJavascript) {
                const result = Terser.minify(packageFileContent, terserOptions)
                if (result.error)
                    throw result.error
                return result.code
            }
        } catch (error) {
            error.message = `minimizing guest code file "${guestFile.relativePath}"\n${JSON.stringify(error)}`
            throw error
        }
        return packageFileContent
    }

    async generate(hostProject) {
        const packageFileContent = this.processPackage(await this.getPackageContent())
        await hostProject.setPackageFileContent(this.relativePath, packageFileContent)
    }
}

module.exports = {PackageFile}