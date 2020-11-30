class BundleProjectFile {

    constructor(bundleName, content, bundles = [bundleName]) {
        Object.assign(this, {bundleName, content, bundles})
    }

    get id() {
        return this.bundleName
    }

    get logText() {
        return `Bundle "${this.bundleName}"`
    }

    isToUpdate(newFile) {
        return this.bundleName === newFile.bundleName &&
            (newFile.content !== this.content ||
                this.bundles.length !== 1 || this.bundles[0] !== this.bundleName)
    }

    async addToTargetProject(targetProject) {
        await targetProject.addBundleToProject(this.bundleName, this.content)
    }

    async updateInTargetProject(targetProject) {
        await targetProject.removeBundleFromProject(this.bundleName)
        await targetProject.addBundleToProject(this.bundleName, this.content)
    }

    async removeFromTargetProject(targetProject) {
        await targetProject.removeBundleFromProject(this.bundleName)
    }
}

module.exports = {BundleProjectFile}