const xcode = require('xcode')
const path = require('path')
const touch = require('touch')
const {File} = require('./File')
const {Directory} = require('./Directory')
const {FileWalker} = require('./FileWalker')
const {JS_FILE_EXT, JSON_FILE_EXT, SWIFT_FILE_EXT} = require('./fileExtensions')
const BUNDLE_FILE_TYPE = '"wrapper.plug-in"'
const SOURCE_FILE_TYPE = 'sourcecode.swift'
const XCODE_PATH_SEPARATOR = '/'

class XcodeHostProject {

    constructor(targetConfig, log) {
        Object.assign(this, {targetConfig, log})
    }

    get project() {
        if (!this._project) {
            this._project = xcode.project(this.targetConfig.xcodeProjectFilePath).parseSync()
        }
        return this._project
    }

    get mainGroup() {
        const mainGroupKey = this.project.getFirstProject().firstProject.mainGroup
        return this.getGroupByKey(mainGroupKey)
    }

    get compileTargetKeys() {
        const targetObjects = this.project.pbxNativeTargetSection()
        const allTargets = this.allTargetKeys.map(targetKey => ({key: targetKey, obj: targetObjects[targetKey]}))
        const targetKeys = []
        for (const compileTargetName of this.targetConfig.compileTargets) {
            const compileTarget = allTargets.find(target => target.obj.name === compileTargetName)
            if (!compileTarget) {
                throw new Error(`compile target "${compileTargetName}" not found in the project`)
            }
            targetKeys.push(compileTarget.key)
        }
        return targetKeys
    }

    get allTargetKeys() {
        const targetObjects = this.project.pbxNativeTargetSection()
        return Object.keys(targetObjects).filter(targetKey => targetObjects[targetKey].name)
    }

    get xcodeProjectDir() {
        return new Directory(this.targetConfig.xcodeProjectDirPath, this.targetConfig.xcodeProjectDirPath)
    }

    encodePath(path) {
        if (path === null || path === undefined)
            return path
        return path.includes('"') ? `"${path.replace(/"/g, '\\"')}"` : path
    }

    decodePath(encodedPath) {
        if (encodedPath === null || encodedPath === undefined)
            return encodedPath
        const result = /^"?(.*?)"?$/s.exec(encodedPath)
        return result[1].replace(/\\"/g, '"')
    }

    normalizeRelativePath(pathToNormalize) {
        return pathToNormalize.split(XCODE_PATH_SEPARATOR).filter(part => part).join(XCODE_PATH_SEPARATOR)
    }

    buildNode(node, key, comment, fatherGroup) {
        if (node) {
            node = Object.assign({}, node)
            node.key = key

            const fatherPathParts = fatherGroup ? fatherGroup.relativePath.split(XCODE_PATH_SEPARATOR) : []
            const nodePath = this.decodePath(node.path)
            const nodePathParts = nodePath ? nodePath.split(XCODE_PATH_SEPARATOR) : []
            node.relativePath = [...fatherPathParts, ...nodePathParts].filter(part => part).join(XCODE_PATH_SEPARATOR)
            node.debugLocation = `${fatherGroup ? fatherGroup.debugLocation + XCODE_PATH_SEPARATOR : ''}${comment ? comment : 'Project'}`
            node.fileType = node.explicitFileType || node.lastKnownFileType
            if (node.sourceTree !== '"<group>"') {
                this.relativeToGroupWarning = this.relativeToGroupWarning || new Set()
                if (!this.relativeToGroupWarning.has(node.debugLocation)) {
                    this.log.warning(`"${node.debugLocation}": file location attribute is not "Relative to Group", this config `
                        + 'is not supported so the file will be skipped\n')
                    this.relativeToGroupWarning.add(node.debugLocation)
                }
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

    getGroupByDirPath(dirPath, fatherGroup = this.mainGroup) {
        dirPath = this.normalizeRelativePath(dirPath)

        for (const child of fatherGroup.children) {
            const childGroup = this.getGroupByKey(child.value, fatherGroup)
            if (!childGroup)
                continue

            if (childGroup.relativePath === dirPath)
                return childGroup

            const targetGroup = this.getGroupByDirPath(dirPath, childGroup)
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

    getFile(group, relativePath) {
        relativePath = this.normalizeRelativePath(relativePath)

        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            if (childGroup) {
                const childFile = this.getFile(childGroup, relativePath)
                if (childFile) {
                    return childFile
                }
                continue
            }

            const childFile = this.getFileByKey(child.value, group)
            if (childFile.relativePath === relativePath) {
                return {fatherGroup: group, file: childFile}
            }
        }
        return null
    }

    async getHostFiles() {
        const hostDirGroup = this.getGroupByDirPath(this.targetConfig.hostDirName)
        if (!hostDirGroup)
            return []
        const files = this.getFiles(hostDirGroup)
        this.checkForIncompatibleHostFiles(files)

        const xcodeProjectDirPath = this.targetConfig.xcodeProjectDirPath
        const hostDirPath = this.targetConfig.hostDirPath
        return files
            .map(file => new File(path.join(xcodeProjectDirPath, file.relativePath), hostDirPath))
            .filter(file => file.ext === SWIFT_FILE_EXT)
    }

    checkForIncompatibleHostFiles(files) {
        const notSourceFiles = files.filter(file => file.fileType !== SOURCE_FILE_TYPE && file.fileType !== BUNDLE_FILE_TYPE)
        if (notSourceFiles.length) {
            const fileNames = notSourceFiles.map(file => `"${file.relativePath}"`).join(', ')
            throw new Error(`${fileNames} not supported: only .swift source files and bundles can be placed inside the host directory`)
        }
    }

    async getPackageFiles() {
        const packageDirPath = this.targetConfig.packageDirPath
        const files = await (new FileWalker(packageDirPath)).getFiles()
        this.checkForIncompatiblePackageFiles(files)
        return files
    }

    checkForIncompatiblePackageFiles(files) {
        const notSourceFiles = files.filter(file => file.ext !== JS_FILE_EXT && file.ext !== JSON_FILE_EXT && file.ext !== '.mjs')
        if (notSourceFiles.length) {
            const fileNames = notSourceFiles.map(file => `"${file.relativePath}"`).join(', ')
            throw new Error(`${fileNames} not supported: only Javascript source files can be placed inside the package directory`)
        }
    }

    async cleanEmptyDirs() {
        const hostDirGroup = this.getGroupByDirPath(this.targetConfig.hostDirName)
        if (hostDirGroup)
            await this.cleanEmptyGroups(hostDirGroup)

        const packageDir = new Directory(this.targetConfig.packageDirPath)
        await packageDir.cleanEmptyDirs()
    }

    async save() {
        await this.cleanEmptyDirs()
        const projectFile = new File(this.targetConfig.xcodeProjectFilePath)
        await projectFile.setContent(this.project.writeSync())
        await touch(this.targetConfig.xcodeProjectPath)
    }

    /** REMOVE THINGS */

    async removeHostFile(pathRelativeToHostDir) {
        const hostDirGroup = this.getGroupByDirPath(this.targetConfig.hostDirName)
        const hostFileRef = this.getFile(hostDirGroup, path.join(this.targetConfig.hostDirName, pathRelativeToHostDir))
        if (hostFileRef) {
            this.removePbxGroupChild(hostFileRef.fatherGroup, hostFileRef.file)
            this.removePbxSourceFile(hostFileRef.fatherGroup, hostFileRef.file)
        }

        const hostFile = this.xcodeProjectDir
            .getSubDir(this.targetConfig.hostDirName)
            .getSubFile(pathRelativeToHostDir)

        try {
            await hostFile.delete()
        } catch (error) {
            error.message = `removing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async removePackageFile(pathRelativeToPackageDir) {
        const packageFile = this.xcodeProjectDir
            .getSubDir(this.targetConfig.hostDirName)
            .getSubDir(this.targetConfig.packageName)
            .getSubFile(pathRelativeToPackageDir)

        try {
            await packageFile.delete()
        } catch (error) {
            error.message = `removing package file "${packageFile.relativePath}"\n${error.message}`
            throw error
        }
    }

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

    async cleanEmptyGroups(group, fatherGroup) {
        let empty = true
        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value, group)
            if (childGroup) {
                const isChildGroupEmpty = await this.cleanEmptyGroups(childGroup, group)
                empty = isChildGroupEmpty && empty
            } else if (childFile) {
                empty = false
            }
        }
        if (empty && fatherGroup) {
            this.removePbxGroupChild(fatherGroup, group)
            this.removePbxGroup(group)
            await this.xcodeProjectDir.getSubDir(group.relativePath).delete()
        }
        return empty
    }

    removePbxGroup(group) {
        const pbxGroup = this.project.hash.project.objects['PBXGroup']
        delete pbxGroup[group.key]
        delete pbxGroup[`${group.key}_comment`]
    }


    /** ADD THINGS */

    async setHostFileContent(pathRelativeToHostDir, hostFileContent) {
        this.addHostFileToProject(pathRelativeToHostDir, false)

        const hostFile = this.xcodeProjectDir
            .getSubDir(this.targetConfig.hostDirName)
            .getSubFile(pathRelativeToHostDir)

        try {
            await hostFile.dir.ensureExists()
            await hostFile.setContent(hostFileContent)
        } catch (error) {
            error.message = `writing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async setPackageFileContent(pathRelativeToPackageDir, packageFileContent) {
        this.addHostFileToProject(this.targetConfig.packageName, true)

        const packageFile = this.xcodeProjectDir
            .getSubDir(this.targetConfig.hostDirName)
            .getSubDir(this.targetConfig.packageName)
            .getSubFile(pathRelativeToPackageDir)

        try {
            await packageFile.dir.ensureExists()
            await packageFile.setContent(packageFileContent)
        } catch (error) {
            error.message = `writing package file "${packageFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    addHostFileToProject(pathRelativeToHostDir, isPackage) {
        const parsedFilePath = path.parse(path.join(this.targetConfig.hostDirName, pathRelativeToHostDir))
        const fatherGroup = this.ensureGroupExists(parsedFilePath.dir)

        const fileBaseName = parsedFilePath.base
        if (fatherGroup.children.some(child => child.comment === fileBaseName))
            return

        const fileKey = this.project.generateUuid()

        const pbxFile = {
            isa: 'PBXFileReference',
            path: this.encodePath(fileBaseName),
            sourceTree: '"<group>"',
            lastKnownFileType: isPackage ? '"wrapper.plug-in"' : 'sourcecode.swift',
        }
        if (!isPackage) {
            pbxFile.fileEncoding = 4
        }
        this.project.pbxFileReferenceSection()[fileKey] = pbxFile
        const commentKey = `${fileKey}_comment`
        this.project.pbxFileReferenceSection()[commentKey] = fileBaseName

        const file = {fileRef: fileKey, basename: fileBaseName}
        this.project.addToPbxGroup(file, fatherGroup.key)


        for (const targetKey of this.compileTargetKeys) {
            file.uuid = this.project.generateUuid()
            file.group = isPackage ? 'Resources' : 'Sources'
            this.project.addToPbxBuildFileSection(file)

            file.target = targetKey
            if (isPackage) {
                this.project.addToPbxResourcesBuildPhase(file)
            } else {
                this.project.addToPbxSourcesBuildPhase(file)
            }
        }
    }

    ensureGroupExists(targetDirPath, fatherGroupPath = '') {
        targetDirPath = this.normalizeRelativePath(targetDirPath)
        const fatherGroup = this.getGroupByDirPath(fatherGroupPath)

        if (targetDirPath === '')
            return fatherGroup

        const targetDirPathParts = targetDirPath.split(XCODE_PATH_SEPARATOR)
        const targetChildGroupName = targetDirPathParts[0]
        let childGroup = this.getGroupByDirPath(path.join(fatherGroupPath, targetChildGroupName))

        if (!childGroup) {
            const pbxGroupUuid = this.project.generateUuid()
            const commentKey = `${pbxGroupUuid}_comment`
            const pbxGroup = {
                isa: 'PBXGroup',
                children: [],
                path: this.encodePath(targetChildGroupName),
                sourceTree: '"<group>"',
            }

            const groups = this.project.hash.project.objects['PBXGroup']

            groups[pbxGroupUuid] = pbxGroup
            groups[commentKey] = targetChildGroupName
            groups[fatherGroup.key].children.push({value: pbxGroupUuid, comment: targetChildGroupName})
            childGroup = this.getGroupByKey(pbxGroupUuid, fatherGroup)
        }

        const remainingTargetDirPath = targetDirPathParts.slice(1, targetDirPathParts.length).join(XCODE_PATH_SEPARATOR)
        return this.ensureGroupExists(remainingTargetDirPath, childGroup.relativePath)
    }
}

module.exports = {XcodeHostProject}