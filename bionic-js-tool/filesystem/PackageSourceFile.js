class PackageSourceFile {

    static build(packageFile) {
        return new PackageSourceFile(packageFile)
    }

    constructor(packageFile) {
        Object.assign(this, {packageFile})
    }

    get path() {
        return this.packageFile.path
    }

    async getSourceFileContent() {
        return this.packageFile.getContent()
    }
}

module.exports = {PackageSourceFile}