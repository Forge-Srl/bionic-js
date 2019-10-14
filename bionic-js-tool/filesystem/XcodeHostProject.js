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

    get project() {
        if (!this._project) {
            this._project = xcode.project(path.resolve(this.targetConfig.xcodeProjectPath, 'project.pbxproj')).parseSync()
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

    deleteFiles(files) {
        for (const file of files) {
            if (file.fileType === BUNDLE_FILE_TYPE) {
                new Directory(file.)
            } else {
                throw new Error(`The file "${fatherGroup.relativePath}/${file.path}" is not a source file and cannot be deleted`)
            }
        }

    }

    emptyGroup(group, targetGroup = group) {

        const files = this.getFiles(group)
        const notSourceFiles = files.filter(file => file.fileType !== SOURCE_FILE_TYPE && file.fileType !== BUNDLE_FILE_TYPE)
        if (notSourceFiles.length) {
            const fileNames = notSourceFiles.map(file => `"${file.relativePath}"`).join(', ')
            this.log.error(`${fileNames} not supported.\nOnly source files and bundles can be deleted.`)
            return
        }
        this.deleteFiles(file)


        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value)

            if (childGroup) {
                this.emptyGroup(childGroup, targetGroup)
            } else if (childFile) {
                this.deleteFile(childFile, group)
            }
        }

        if (group === targetGroup)
            return

        if (group.name) {
            this.deleteEmptyVirtualGroup(group)
        } else if (group.path) {
            this.deleteEmptyDirGroup(group)
        }
    }

    deleteEmptyVirtualGroup(group) {
        this.log.info(`deleting virtual group: ${group.name}`)
    }

    deleteEmptyDirGroup(group) {
        this.log.info(`deleting dir group: ${group.relativePath}`)
    }


    deleteSourceFile(sourceFile, fatherGroup) {
        this.log.info(`deleting source file: "${fatherGroup.relativePath}/${sourceFile.path}"`)
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