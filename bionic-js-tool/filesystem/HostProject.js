const {XcodeHostProject} = require('./XcodeHostProject')
const {JavaHostProject} = require('./JavaHostProject')
const {HostProjectFile} = require('./HostProjectFile')
const {BundleProjectFile} = require('./BundleProjectFile')

class HostProject {

    static build(configuration, log, stats) {
        let targetProject
        if (configuration.language === 'Swift') {
            targetProject = new XcodeHostProject(configuration, log)
        } else if (configuration.language === 'Java') {
            targetProject = new JavaHostProject(configuration, log)
        } else {
            throw new Error(`host project type "${configuration.type}" required in the configuration is not supported`)
        }
        return new HostProject(targetProject, configuration, stats)
    }

    constructor(targetProject, configuration, stats) {
        Object.assign(this, {
            targetProject, configuration, stats,
            oldFiles: new Map(),
            newFiles: new Map(),
        })
    }

    get projectFilesDiff() {
        const filesToAdd = []
        const filesToUpdate = []
        for (const newFile of this.newFiles.values()) {
            const oldFile = this.oldFiles.get(newFile.id)
            if (!oldFile) {
                filesToAdd.push(newFile)
            } else if (oldFile.isToUpdate(newFile)) {
                filesToUpdate.push(newFile)
            }
        }
        const filesToDelete = []
        for (const oldFile of this.oldFiles.values()) {
            if (!this.newFiles.has(oldFile.id)) {
                filesToDelete.push(oldFile)
            }
        }
        return {filesToAdd, filesToUpdate, filesToDelete}
    }

    setHostFileContent(pathRelativeToHostDir, bundles, hostFileContent) {
        const hostProjectFile = new HostProjectFile(pathRelativeToHostDir, bundles, hostFileContent)
        this.newFiles.set(hostProjectFile.id, hostProjectFile)
    }

    setBundleFileContent(bundleName, bundleFileContent) {
        const bundleProjectFile = new BundleProjectFile(bundleName, bundleFileContent)
        this.newFiles.set(bundleProjectFile.id, bundleProjectFile)
    }

    async open() {
        this.oldFiles = new Map((await this.targetProject.getProjectFiles()).map(file => [file.id, file]))
    }

    async save() {
        const projectFilesDiff = this.projectFilesDiff
        for (const projectFile of projectFilesDiff.filesToDelete) {
            await projectFile.removeFromTargetProject(this.targetProject)
        }
        for (const projectFile of projectFilesDiff.filesToUpdate) {
            await projectFile.updateInTargetProject(this.targetProject)
        }
        for (const projectFile of projectFilesDiff.filesToAdd) {
            await projectFile.addToTargetProject(this.targetProject)
        }
        this.stats.setProjectFilesDiff(projectFilesDiff)
        await this.targetProject.save()
    }
}

module.exports = {HostProject}