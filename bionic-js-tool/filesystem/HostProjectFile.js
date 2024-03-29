class HostProjectFile {

    constructor(relativePath, bundles, content, subId = '') {
        Object.assign(this, {relativePath, bundles, content, subId})
    }

    get id() {
        return this.subId ? `${this.relativePath}/$/${this.subId}` : this.relativePath
    }

    get logText() {
        return `Source "${this.relativePath}" - in bundles (${this.bundles.sort().join(', ')})`
    }

    isToUpdate(newFile) {
        return this.relativePath === newFile.relativePath &&
            (this.bundles.sort().join('-') !== newFile.bundles.sort().join('-') ||
                newFile.content !== this.content)
    }

    async addToTargetProject(targetProject) {
        await targetProject.addHostFileToProject(this.relativePath, this.bundles, this.content)
    }

    async updateInTargetProject(targetProject) {
        await targetProject.removeHostFileFromProject(this.relativePath, this.bundles)
        await targetProject.addHostFileToProject(this.relativePath, this.bundles, this.content)
    }

    async removeFromTargetProject(targetProject) {
        await targetProject.removeHostFileFromProject(this.relativePath, this.bundles)
    }
}

module.exports = {HostProjectFile}