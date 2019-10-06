const xcode = require('xcode')
const {File} = require('./File')

class XcodeHostProject {

    constructor(targetConfig) {
        Object.assign(this, {targetConfig})
    }

    async getProjectFileData() {
        return await (new File(this.targetConfig.xcodeProjectPath).getContent())
    }

    async getProject() {
        if (!this._project) {
            const project = xcode.project()
            project.hash = project.parser.parse(await this.getProjectFileData())
            this._project = project
        }
        return this._project
    }

    async getMainGroup() {
        return (await this.getProject()).getFirstProject().firstProject.mainGroup
    }

    async findVirtualGroup(targetVirtualPath, rootGroup, exploredPath = []) {
        if (!rootGroup) {
            rootGroup = await this.getMainGroup()
        }
        if (!Array.isArray(targetVirtualPath)) {
            targetVirtualPath = targetVirtualPath.split('/').filter(part => part !== '')
        }

        if (rootGroup.children.length === 0)
            return null

        for (const child of rootGroup.children) {
            const childGroup = (await this.getProject()).getPBXGroupByKey(child.value)
            if (!childGroup)
                continue
            const pathPart = childGroup.path ? [childGroup.path] : []

            const currentPath = [...exploredPath, ...pathPart]
            if (currentPath.join('/') === targetVirtualPath.join('/'))
                return {group: childGroup, key: child.value}

            const targetGroup = this.findVirtualGroup(targetVirtualPath, childGroup, currentPath)
            if (targetGroup)
                return targetGroup
        }
        return null
    }

    async cleanHostDir(hostDir, rootGroup) {
        const projectGroup = await this.findVirtualGroup(hostDir.relativePath)
        if (!projectGroup) {
            await this.xcodeProject.createGroup(hostDir.relativePath)
        }
    }

    async ensureGroupExists(targetPath, rootGroup) {
        if (!rootGroup) {
            rootGroup = await this.getMainGroup()
        }
        if (!Array.isArray(targetPath)) {
            targetPath = targetPath.split('/').filter(part => part !== '')
        }

        if (rootGroup.children.length === 0)
            return null
    }


    /********/

    async setHostFileContent() {
    }


    async cleanPackageDir(packageDir) {
    }

    async setPackageFileContent() {
    }

    /********/


    async ensureHostDirExists(hostDir) {
        const projectGroup = await this.xcodeProject.findGroup(hostDir.relativePath)
        if (!projectGroup) {
            await this.xcodeProject.createGroup(hostDir.relativePath)
        }
    }

    async deleteHostDir(hostDir) {
        const filesToDelete = []
        const projectGroup = await this.xcodeProject.findGroup(hostDir.relativePath)
        if (projectGroup) {
            const groupFiles = await this.xcodeProject.getGroupFiles(projectGroup)
            for (const groupFile of groupFiles) {
                if (groupFile.sourceTree !== '<group>')
                    throw new Error(`the file "${groupFile.name}" inside the host directory "${hostDir}" has the ` +
                        'attribute Location (as reported in Xcode) different from "Relative to group": this is not ' +
                        'supported; to solve this issue you can set this attribute back to "Relative to group" in ' +
                        'the XCode project')

                if (groupFile.path === undefined)
                    throw new Error(`the group "${groupFile.name}" inside the host directory "${hostDir}" is without ` +
                        'folder: this is not supported; to solve this issue you should delete this group from ' +
                        'the XCode project')
            }

            await this.xcodeProject.deleteHostDir(hostDir.relativePath)
        }
    }

    async setHostFileContent(hostFile, content) {
        try {
            await this.xcodeProject.createFile(hostFile, content, this.targetConfig.compileTargets)
            await hostFile.setContent(content)
        } catch (error) {
            error.message = `writing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async ensurePackageDirExists(packageDir) {
        await packageDir.ensureExists()
    }

    async deletePackageDir(packageDir) {
        packageDir.delete()
    }

    async setPackageFileContent(packageFile, content) {
        try {
            await packageFile.setContent(content)
        } catch (error) {
            error.message = `writing package file "${packageFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async save() {
        fs.writeFile(this.projectPath, (await this.getProject()).writeSync())
    }
}

module.exports = {XcodeHostProject}