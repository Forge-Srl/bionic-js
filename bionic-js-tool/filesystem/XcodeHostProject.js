const xcode = require('xcode')
const path = require('path')
const SOURCE_FILE_TYPE = 'sourcecode.swift'
const BUNDLE_FILE_TYPE = '"wrapper.plug-in"'
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

    get targetKeys() {
        const targetObjects = this.project.pbxNativeTargetSection()
        return Object.keys(targetObjects).filter(targetKey => this.targetConfig.compileTargets.includes(targetObjects[targetKey].name))
    }

    get allTargetKeys() {
        const targetObjects = this.project.pbxNativeTargetSection()
        return Object.keys(targetObjects).filter(targetKey => targetObjects[targetKey].name)
    }

    normalizePath(path) {
        return path.split(path.sep).filter(part => part).join(path.sep)
    }

    buildNode(node, key, comment, fatherGroup) {
        if (node) {
            node = Object.assign({}, node)
            node.key = key

            const fatherPathParts = fatherGroup ? fatherGroup.relativePath.split(path.sep) : []
            const nodePathParts = node.path ? node.path.split(path.sep) : []
            node.relativePath = [...fatherPathParts, ...nodePathParts].filter(part => part).join(path.sep)
            node.debugLocation = `${fatherGroup ? fatherGroup.debugLocation + path.sep : ''}${comment ? comment : 'Project'}`
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
        return this.buildNode(group, key, comment, fatherGroup)
    }

    getFileByKey(key, fatherGroup) {
        const file = this.project.pbxFileReferenceSection()[key]
        const comment = this.project.pbxFileReferenceSection()[`${key}_comment`]
        return this.buildNode(file, key, comment, fatherGroup)
    }

    findGroupByDirPath(dirPath, rootGroup = this.mainGroup) {
        dirPath = this.normalizePath(dirPath)

        for (const child of rootGroup.children) {
            const childGroup = this.getGroupByKey(child.value, rootGroup)
            if (!childGroup)
                continue

            if (childGroup.relativePath === dirPath)
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
            const childFile = this.getFileByKey(child.value, group)

            if (childGroup) {
                files = [...files, ...this.getFiles(childGroup)]
            } else if (childFile) {
                files = [...files, childFile]
            }
        }
        return files
    }

    async save() {
        const projectFile = new File(this.projectFilePath, this.targetConfig.xcodeProjectDirPath)
        await projectFile.setContent(this.project.writeSync())
    }

    /** REMOVE THINGS */

    removePbxGroupChild(father, childGroup) {
        const pbxGroup = this.project.getPBXGroupByKey(father.key)
        pbxGroup.children = pbxGroup.children.filter(child => child.value !== childGroup.key)
    }

    removePbxSourceFile(father, sourceFile) {
        const file = this.project.removeFile(sourceFile.path, father.key, null)
        this.project.removeFromPbxBuildFileSection(file)
        for (const targetKey of this.allTargetKeys) {
            file.target = targetKey
            if (sourceFile.fileType === SOURCE_FILE_TYPE) {
                this.project.removeFromPbxSourcesBuildPhase(file)
            } else {
                this.project.removeFromPbxResourcesBuildPhase(file)
            }
        }
    }

    removePbxGroup(group) {
        const pbxGroup = this.project.hash.project.objects['PBXGroup']
        delete pbxGroup[group.key]
    }

    checkHostFilesToDelete(files) {
        const notSourceFiles = files.filter(file => file.fileType !== SOURCE_FILE_TYPE && file.fileType !== BUNDLE_FILE_TYPE)
        if (notSourceFiles.length) {
            const fileNames = notSourceFiles.map(file => `"${file.relativePath}"`).join(', ')
            throw new Error(`${fileNames} cannot be deleted: only source files and bundles can be placed inside the host directory`)
        }
    }

    async emptyDirectory(group) {
        const directoryPath = path.resolve(this.targetConfig.xcodeProjectDirPath, group.relativePath)
        const bundleDir = new Directory(directoryPath, this.targetConfig.xcodeProjectDirPath)
        await bundleDir.delete()
        await bundleDir.ensureExists()
    }

    async emptyGroup(group, targetGroup = group) {
        if (group === targetGroup) {
            this.checkHostFilesToDelete(this.getFiles(group))
            await this.emptyDirectory(group)
        }

        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value, group)
            if (childGroup) {
                this.removePbxGroupChild(group, childGroup)
                this.emptyGroup(childGroup, targetGroup)
            } else if (childFile) {
                this.removePbxGroupChild(group, childFile)
                this.removePbxSourceFile(group, childFile)
            }
        }

        if (group !== targetGroup) {
            this.removePbxGroup(group)
            await this.removeGroupDirectory(group)
        }
    }

    async removeGroupDirectory(group) {
        if (group.path) {
            const dirPath = path.resolve(this.targetConfig.xcodeProjectDirPath, group.relativePath)
            const groupDir = new Directory(dirPath, this.targetConfig.xcodeProjectDirPath)
            await groupDir.delete()
        }
    }

    async cleanHostDir(hostDirPath) {
        const hostDirGroup = this.findGroupByDirPath(hostDirPath)
        await this.emptyGroup(hostDirGroup)
    }

    /** ADD THINGS */

    // dir1/dir2/dir3
    // dir2/dir3        dir1
    // dir3             dir1/dir2


    ensureGroupExists(targetDirPath, fatherGroupPath = '') {
        targetDirPath = this.normalizePath(targetDirPath)
        if (targetDirPath === '')
            return

        const fatherGroup = this.findGroupByDirPath(fatherGroupPath)

        const targetDirPathParts = targetDirPath.split(path.sep)
        const targetChildGroupName = targetDirPathParts[0]
        let childGroup = this.findGroupByDirPath(path.join(fatherGroupPath, targetChildGroupName))

        if (!childGroup) {
            const pbxGroupUuid = this.project.generateUuid()
            const commentKey = `${pbxGroupUuid}_comment`
            const pbxGroup = {
                isa: 'PBXGroup',
                children: [],
                path: targetChildGroupName,
                sourceTree: '"<group>"',
            }

            const groups = this.project.hash.project.objects['PBXGroup']

            groups[pbxGroupUuid] = pbxGroup
            groups[commentKey] = targetChildGroupName
            groups[fatherGroup.key].children.push({value: pbxGroupUuid, comment: targetChildGroupName})
            childGroup = this.getGroupByKey(pbxGroupUuid, fatherGroup)
        }

        const remainingTargetDirPath = targetDirPathParts.slice(1, targetDirPathParts.length).join(path.sep)
        this.ensureGroupExists(remainingTargetDirPath, childGroup.relativePath)
    }

    addPbxSourceFile(father, sourceFile) {
        const file = this.project.addFile(sourceFile.path, father.key, null)
        this.project.addToPbxBuildFileSection(file)
        for (const targetKey of this.targetKeys) {
            file.target = targetKey
            if (sourceFile.fileType === SOURCE_FILE_TYPE) {
                this.project.addToPbxSourcesBuildPhase(file)
            } else {
                this.project.addToPbxResourcesBuildPhase(file)
            }
        }
    }

    async setHostFileContent(relativePath, hostFileContent) {
        try {
            const hostFile = new File(relativePath)
            await hostFile.dir.ensureExists()
            await hostFile.setContent(hostFileContent)
        } catch (error) {
            error.message = `writing host file "${relativePath}"\n${error.message}`
            throw error
        }
    }

    async setPackageFileContent(relativePath, packageFileContent) {
        try {
            const packageFile = new File(relativePath)
            await packageFile.dir.ensureExists()
            await packageFile.setContent(packageFileContent)
        } catch (error) {
            error.message = `writing package file "${relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {XcodeHostProject}