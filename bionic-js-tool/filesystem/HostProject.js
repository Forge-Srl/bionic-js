const {XcodeHostProject} = require('./XcodeHostProject')

class HostProject {

    static build(targetConfig, log, stats) {
        let targetProject
        if (targetConfig.hostLanguage === 'Swift') {
            targetProject = new XcodeHostProject(targetConfig, log)
        } else {
            throw new Error(`the hostLanguage "${targetConfig.hostLanguage}" required in the configuration is not supported`)
        }
        return new HostProject(targetProject, stats)
    }

    constructor(targetProject, stats) {
        Object.assign(this, {
            targetProject, stats,
            oldHostFiles: new Map(),
            oldPackageFiles: new Map(),
            newHostFiles: new Map(),
            newPackageFiles: new Map(),
        })
    }

    get hostFilesDiff() {
        return this.getFilesDiff(this.newHostFiles, this.oldHostFiles)
    }

    get packageFilesDiff() {
        return this.getFilesDiff(this.newPackageFiles, this.oldPackageFiles)
    }

    getFilesDiff(newFiles, oldFiles) {
        const filesToAdd = []
        const filesToUpdate = []
        for (const newFileKeyValue of [...newFiles]) {

            const newFile = {relativePath: newFileKeyValue[0], content: newFileKeyValue[1]}
            const oldFile = oldFiles.get(newFile.relativePath)
            if (oldFile) {
                filesToUpdate.push(Object.assign(newFile, {oldFile}))
            } else {
                filesToAdd.push(newFile)
            }
        }

        const filesToDelete = []
        for (const oldFileKeyValue of [...oldFiles]) {

            const oldFile = {relativePath: oldFileKeyValue[0]}
            if (!newFiles.has(oldFile.relativePath)) {
                filesToDelete.push(oldFile)
            }
        }

        return {filesToAdd, filesToUpdate, filesToDelete}
    }

    async open() {
        this.oldHostFiles = new Map((await this.targetProject.getHostFiles())
            .map(hostFile => [hostFile.relativePath, hostFile]))
        this.oldPackageFiles = new Map((await this.targetProject.getPackageFiles())
            .map(packageFile => [packageFile.relativePath, packageFile]))
    }

    async setHostFileContent(pathRelativeToHostDir, hostFileContent) {
        this.newHostFiles.set(pathRelativeToHostDir, hostFileContent)
    }

    async setPackageFileContent(pathRelativeToPackageDir, packageFileContent) {
        this.newPackageFiles.set(pathRelativeToPackageDir, packageFileContent)
    }

    async isToUpdate(oldFile, newContent) {
        if (!await oldFile.exists()) {
            return true
        }
        return await oldFile.getContent() !== newContent
    }

    async save() {
        {
            const {filesToDelete, filesToUpdate, filesToAdd} = this.hostFilesDiff
            for (const hostFile of filesToDelete) {
                this.stats.deleteHostFile(hostFile.relativePath)
                await this.targetProject.removeHostFile(hostFile.relativePath)
            }
            for (const hostFile of filesToUpdate) {
                if (await this.isToUpdate(hostFile.oldFile, hostFile.content)) {
                    this.stats.updateHostFile(hostFile.relativePath)
                    await this.targetProject.removeHostFile(hostFile.relativePath)
                    await this.targetProject.setHostFileContent(hostFile.relativePath, hostFile.content)
                }
            }
            for (const hostFile of filesToAdd) {
                this.stats.addHostFile(hostFile.relativePath)
                await this.targetProject.setHostFileContent(hostFile.relativePath, hostFile.content)
            }
        }
        {
            const {filesToDelete, filesToUpdate, filesToAdd} = this.packageFilesDiff
            for (const packageFile of filesToDelete) {
                this.stats.deletePackageFile(packageFile.relativePath)
                await this.targetProject.removePackageFile(packageFile.relativePath)
            }
            for (const packageFile of filesToUpdate) {
                if (await this.isToUpdate(packageFile.oldFile, packageFile.content)) {
                    this.stats.updatePackageFile(packageFile.relativePath)
                    await this.targetProject.removePackageFile(packageFile.relativePath)
                    await this.targetProject.setPackageFileContent(packageFile.relativePath, packageFile.content)
                }
            }
            for (const packageFile of filesToAdd) {
                this.stats.addPackageFile(packageFile.relativePath)
                await this.targetProject.setPackageFileContent(packageFile.relativePath, packageFile.content)
            }
        }
        await this.targetProject.save()
    }
}

module.exports = {HostProject}