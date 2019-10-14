const xcode = require('xcode')
const path = require('path')
const SOURCE_FILE_TYPE = 'sourcecode.swift'
const BUNDLE_FILE_TYPE = 'wrapper.plug-in'
const {File} = require('./File')
const {Directory} = require('./Directory')

class XcodeHostProject {

    constructor(targetConfig, log) {
        Object.assign(this, {targetConfig, log})
    }

    get projectFilePath() {
        return path.resolve(this.targetConfig.xcodeProjectPath, 'project.pbxproj')
    }

    get project() {
        if (!this._project) {
            this._project = xcode.project(this.projectFilePath).parseSync()
        }
        return this._project
    }

    get mainGroup() {
        const mainGroupKey = this.project.getFirstProject().firstProject.mainGroup
        return this.getGroupByKey(mainGroupKey)
    }

    buildNode(node, comment, fatherGroup) {
        if (node) {
            node = Object.assign({}, node)
            node.relativePathParts = [...(fatherGroup ? fatherGroup.relativePathParts : []), ...(node.path ? [node.path] : [])]
            node.relativePath = node.relativePathParts.join('/')
            node.debugLocation = `${fatherGroup ? fatherGroup.debugLocation + '/' : ''}${comment ? comment : 'Project'}`
            node.fileType = node.explicitFileType || node.lastKnownFileType
            if (node.sourceTree !== '"<group>"') {
                this.log.warning(`"${node.debugLocation}": file location attribute is not "Relative to Group", this config `
                    + 'is not supported so the file will be skipped')
                return null
            }
        }
        return node
    }

    getGroupByKey(key, fatherGroup) {
        const group = this.project.getPBXGroupByKey(key)
        const comment = this.project.getPBXGroupByKey(`${key}_comment`)
        return this.buildNode(group, comment, fatherGroup)
    }

    getFileByKey(key, fatherGroup) {
        const file = this.project.pbxFileReferenceSection()[key]
        const comment = this.project.pbxFileReferenceSection()[`${key}_comment`]
        return this.buildNode(file, comment, fatherGroup)
    }

    findGroupByDirPath(dirPath, rootGroup = this.mainGroup) {
        if (!Array.isArray(dirPath)) {
            dirPath = dirPath.split('/').filter(part => part.trim() !== '')
        }

        for (const child of rootGroup.children) {
            const childGroup = this.getGroupByKey(child.value, rootGroup)
            if (!childGroup)
                continue

            if (childGroup.relativePath === dirPath.join('/'))
                return childGroup

            const targetGroup = this.findGroupByDirPath(dirPath, childGroup)
            if (targetGroup)
                return targetGroup
        }
        return null
    }

    getFiles(group) {
        let files = []
        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value)

            if (childGroup) {
                files = [...files, ...this.getFiles(childGroup)]
            } else if (childFile) {
                files = [...files, childFile]
            }
        }
        return files
    }

    async save() {
        const projectFile = new File(this.projectFilePath, this.targetConfig.xcodeProjectDir)
        await projectFile.setContent(this.project.writeSync())
    }

    async deleteFiles(files) {
        const deletePromises = files.forEach(file => {
            const filePath = path.resolve(this.targetConfig.xcodeProjectDir, file.relativePath)
            if (file.fileType === BUNDLE_FILE_TYPE) {
                const bundleDir = new Directory(filePath, this.targetConfig.xcodeProjectDir)
                return bundleDir.delete()
            } else {
                const file = new File(filePath, this.targetConfig.xcodeProjectDir)
                return file.delete()
            }
        })
        await Promise.all(deletePromises)
    }

    async emptyGroup(group, targetGroup = group) {

        if (group === targetGroup) {
            const files = this.getFiles(group)
            const notSourceFiles = files.filter(file => file.fileType !== SOURCE_FILE_TYPE && file.fileType !== BUNDLE_FILE_TYPE)
            if (notSourceFiles.length) {
                const fileNames = notSourceFiles.map(file => `"${file.relativePath}"`).join(', ')
                this.log.error(`${fileNames} not supported. Only source files and bundles can be deleted.`)
                return
            }
            await this.deleteFiles(files)
        }

        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            if (childGroup) {
                this.emptyGroup(childGroup, targetGroup)
            }
        }

        if (group === targetGroup)
            return

        this.project.removePbxGroup(group)
        if (group.path) {
            const dirPath = path.resolve(this.targetConfig.xcodeProjectDir, group.relativePath)
            const groupDir = new Directory(dirPath, this.targetConfig.xcodeProjectDir)
            await groupDir.delete()
        }
        this.project
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
}

module.exports = {XcodeHostProject}